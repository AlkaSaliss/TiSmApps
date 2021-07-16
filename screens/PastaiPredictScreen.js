import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import Slider from '@react-native-community/slider'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'
import AnimatedLoader from "react-native-animated-loader"


const modelJson = require('../assets/models/pastai_tfjs/model.json')
const modelWeights = [
  require('../assets/models/pastai_tfjs/group1-shard1of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard2of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard3of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard4of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard5of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard6of7.bin'),
  require('../assets/models/pastai_tfjs/group1-shard7of7.bin')
]


const convert_xywh2wx1y1x2y2 = (xywh) => {
  const [x, y, w, h] = tf.split(xywh, 4, -1)
  const x1 = tf.sub(x, tf.div(w, tf.scalar(2.0)))
  const y1 = tf.sub(y, tf.div(h, tf.scalar(2.0)))
  const x2 = tf.add(x, tf.div(w, tf.scalar(2.0)))
  const y2 = tf.add(y, tf.div(h, tf.scalar(2.0)))
  const result = tf.concat([x1, y1, x2, y2], 1)
  return result
}

const non_max_suppression_tf = (preds, iouThreshold = 0.45, scoreThreshold = 0.25) => {
  const boxes = convert_xywh2wx1y1x2y2(preds.slice([0, 0], [-1, 4]))  // predicted boxes
  const probas = preds.slice([0, 4], [-1, 1])  //objectness proba
  const classes = preds.slice([0, 5], [-1, 1])  // classes proba
  const scores = tf.mul(probas, classes).squeeze()
  // get selected boxes indices
  const maxOutputSize = 100
  const nms_boxes = tf.image.nonMaxSuppression(
    boxes,
    scores,
    maxOutputSize,
    iouThreshold,
    scoreThreshold
  )

  //  get boxes from NMS
  return tf.gather(boxes, nms_boxes)
}


export default ({ route, navigation }) => {

  const [isTfReady, setIsTfReady] = useState(false)
  const [model, setModel] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [hasPredicted, setHasPredicted] = useState(false)
  const [iouThreshold, setIouThreshold] = useState(0.45)
  const [scoreThreshold, setScoreThreshold] = useState(0.25)
  const [imageY, setImageY] = useState(null)
  const [hScale, setHScale] = useState(null)
  const [wScale, setWScale] = useState(null)
  const { data } = route.params
  const modelInputSize = 256

  useEffect(() => {

    const loadModel = async () => {
      await tf.ready()
      const tf_model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights))
      setModel(tf_model)
      setIsTfReady(true)
    }
    loadModel()

  }, [])


  const toMatrix = (arr, width) =>
    arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows, [])

  const predict = () => {
    if (isTfReady && !hasPredicted) {
      const bufferData = Buffer.from(data.base64, 'base64')
      const imageData = new Uint8Array(bufferData)
      const imageTensor = decodeJpeg(imageData)
      const imageTensorResized = tf.image.resizeBilinear(imageTensor, [modelInputSize, modelInputSize])
        .expandDims(0)
        .div(255.0)
      const result = model.predict(imageTensorResized).squeeze()
      const bboxes = non_max_suppression_tf(result, iouThreshold, scoreThreshold).mul(modelInputSize).dataSync()
      const nCoords = 4
      const bboxes_reshaped = bboxes.length ?
        toMatrix(bboxes, nCoords) : []
      setPredictions(bboxes_reshaped)
      setHasPredicted(true)
    }
  }

  // Draw bounding boxes on image
  const bboxViews = predictions.map((box, idx) => {
    const style = {
      height: (box[3] - box[1]) * hScale,
      width: (box[2] - box[0]) * wScale,
      borderColor: 'rgb(0, 200, 0)',
      borderWidth: 3,
      position: 'absolute',
      zIndex: 99,
      top: box[1] * hScale,
      left: box[0] * wScale
    }
    return (
      <View key={idx} style={style}></View>
    )
  })


  return (
    <View style={{ flex: 1, alignContent: 'space-between' }}>
      {
        model === null ?
          <View style={{ flex: 1, paddingBottom: 100, alignItems: 'center' }}>
            <AnimatedLoader
              visible={model === null}
              overlayColor="rgba(255,255,255,0.75)"
              source={require("../assets/images/7597-loader-animation.json")}
              animationStyle={{ width: 100, height: 100 }}
              speed={2.5}
            ><Text>Exploring universe, loading model ...</Text></AnimatedLoader>
          </View>
          :
          <View style={{ flex: 1 }}>
            <View style={{ flex: 6, padding: 10, marginBottom: 20 }}>
              <View style={styles.bboxViews}>
                {bboxViews}
                <Image
                  source={{ uri: data.uri }}
                  style={{ width: "100%", height: '100%', borderRadius: 10, resizeMode: 'stretch' }}
                  onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout
                    setHScale(height / modelInputSize)
                    setWScale(width / modelInputSize)
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 3 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }} >
                Number of Watermelons : {predictions.length}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingTop: 5
              }}
              >
                <Text>IoU Threshold ({iouThreshold})</Text>
                <Slider
                  style={{ width: 220, height: 40, }}
                  minimumValue={0}
                  maximumValue={1}
                  value={iouThreshold}
                  step={0.05}
                  minimumTrackTintColor='rgb(0, 100, 0)'
                  maximumTrackTintColor='rgb(0, 200, 0)'
                  onSlidingComplete={value => {
                    setIouThreshold(Math.round((value + Number.EPSILON) * 100) / 100)
                    setHasPredicted(!hasPredicted)
                  }}
                />
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingTop: 5
              }}
              >
                <Text>Conf. Threshold ({scoreThreshold})</Text>
                <Slider
                  style={{ width: 220, height: 40, }}
                  minimumValue={0}
                  maximumValue={1}
                  value={scoreThreshold}
                  step={0.05}
                  minimumTrackTintColor='rgb(0, 100, 0)'
                  maximumTrackTintColor='rgb(0, 200, 0)'
                  onSlidingComplete={value => {
                    setScoreThreshold(Math.round((value + Number.EPSILON) * 100) / 100)
                    setHasPredicted(!hasPredicted)
                  }}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <Button
                  icon={<Icon name='arrow-left-bold-circle' color='#ffffff' type='material-community' />}
                  buttonStyle={styles.buttonStyle}
                  title='Upload Another'
                  onPress={() => navigation.navigate('Pastai')} />
                <Button
                  icon={<Icon name='arrow-right-drop-circle' color='#ffffff' type='material-community' />}
                  buttonStyle={styles.buttonStyle}
                  title='Predict'
                  onPress={() => predict()} />
              </View>
            </View>
          </View>
      }

    </View>

  )
}

const styles = StyleSheet.create({
  bboxViews: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  buttonsContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginTop: 0,
    paddingTop: 30,
    paddingBottom: 0,
    marginBottom: 0
  },
  buttonStyle: {
    backgroundColor: '#009900',
    borderRadius: 5,
    // marginLeft: 0,
    // marginRight: 0,
    paddingBottom: 5,
  }
})