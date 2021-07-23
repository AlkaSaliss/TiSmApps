import React, { useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import Slider from '@react-native-community/slider'
import { decodeJpeg } from '@tensorflow/tfjs-react-native'
import { ModelsContext } from '../utils/ModelsContext'
import { nonMaxSuppressionYolo } from '../utils/tf_utils'


export default ({ route, navigation }) => {

  const [predictions, setPredictions] = useState([])
  const [hasPredicted, setHasPredicted] = useState(false)
  const [iouThreshold, setIouThreshold] = useState(0.45)
  const [scoreThreshold, setScoreThreshold] = useState(0.25)
  const [hScale, setHScale] = useState(null)
  const [wScale, setWScale] = useState(null)
  const { data } = route.params
  const modelInputSize = 256

  const { tf, pastaiModel } = useContext(ModelsContext)

  const toMatrix = (arr, width) =>
    arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows, [])

  const predict = async () => {
    if (!hasPredicted) {
      const bufferData = Buffer.from(data.base64, 'base64')
      const imageData = new Uint8Array(bufferData)
      const imageTensor = decodeJpeg(imageData)
      const imageTensorResized = tf.image.resizeBilinear(imageTensor, [modelInputSize, modelInputSize])
        .expandDims(0)
        .div(255.0)
      const result = pastaiModel.predict(imageTensorResized).squeeze()
      const bboxes = (await nonMaxSuppressionYolo(tf, result, iouThreshold, scoreThreshold)).mul(modelInputSize).dataSync()
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

        <View style={{ flex: 3, marginBottom: 10 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }} >
            Number of Watermelons : {predictions.length}
          </Text>
          <View style={styles.slidersContainer} >
            <Text>IoU Threshold ({iouThreshold})</Text>
            <Slider
              style={styles.sliders}
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
          <View style={styles.slidersContainer} >
            <Text>Conf. Threshold ({scoreThreshold})</Text>
            <Slider
              style={styles.sliders}
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
    paddingHorizontal: 10,
    marginTop: 0,
    paddingTop: 30,
    paddingBottom: 0,
    marginBottom: 0
  },
  buttonStyle: {
    backgroundColor: '#009900',
    borderRadius: 5,
    paddingTop: 0,
    paddingBottom: 0,
    height: 35,
    width: 150
  },
  sliders: {
    width: 220,
    height: 40,
  },
  slidersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 5
  }
})
