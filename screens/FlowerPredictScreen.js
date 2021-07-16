import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native'
import AnimatedLoader from "react-native-animated-loader"
import targets from '../assets/models/targets.json'


const modelJson = require('../assets/models/convnet/model.json')
const modelWeights = require('../assets/models/convnet/group1-shard1of1.bin')


const ChartComponent = ({ data }) => {

  return (
    <View
      style={{
        backgroundColor: '#2b2a31',
        alignItems: "center",
        width: "90%",
        borderRadius: 5
      }}
    >
      <VictoryChart
        width={300}
        height={300}
        theme={VictoryTheme.material}
      // domainPadding={{ x: 10, y: 10 }}
      // padding={{ top: 20, bottom: 60, right: 30, left: 50 }}
      >
        <VictoryLabel
          text="Predictions"
          x={150} y={20}
          textAnchor="middle"
          style={{ fill: 'white', fontSize: 20 }}
        />
        <VictoryAxis
          style={{
            grid: { stroke: 'none' },
            tickLabels: {
              fontSize: 14,
              fill: 'white',
              fontWeight: 'bold',
              angle: -50,
              padding: 12
            }
          }}
        />
        <VictoryBar
          data={data}
          x="idx"
          y="value"
          labels={({ datum }) => `${datum.value}%`}
          cornerRadius={10}
          categories={{ x: data.map(item => item.key) }}
          style={{
            data: { fill: "#66ff66" },
            labels: { fill: "white", fontSize: 14 },
          }}
          barRatio={0.8}
        />
      </VictoryChart>
    </View>
  )
}


export default ({ route, navigation }) => {

  const [isTfReady, setIsTfReady] = useState(false)
  const [model, setModel] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [hasPredicted, setHasPredicted] = useState(false)
  const { data } = route.params
  const inputSize = [224, 224]

  useEffect(() => {

    const loadModel = async () => {
      await tf.ready()
      const tf_model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
      setModel(tf_model)
      setIsTfReady(true)
    }
    loadModel()

  }, [])

  const predict = () => {
    if (isTfReady && !hasPredicted) {
      const bufferData = Buffer.from(data.base64, 'base64')
      const imageData = new Uint8Array(bufferData)
      const imageTensor = decodeJpeg(imageData)
      const imageTensorResized = tf.image.resizeBilinear(imageTensor, inputSize,)
        .expandDims(0)
        .div(255.0)
      const result = model.predict(imageTensorResized).mul(100).round().dataSync()
      const resultData = targets.map((item, i) => ({ ...item, value: result[i] }))
      setPredictions(resultData)
      setHasPredicted(true)
    }
  }

  const imagePredsFlex = {
    image: hasPredicted ? 4 : 7,
    preds: hasPredicted ? 4 : 2
  }

  return (
    <View style={{ flex: 1, alignContent: 'space-between' }}>
      <View style={{ flex: imagePredsFlex.image, padding: 10, marginBottom: 20 }}>
        <Image
          source={{ uri: data.uri }}
          style={{ width: "100%", height: '100%', borderRadius: 10, resizeMode: 'stretch' }}
        />
      </View>
      <View style={{ flex: imagePredsFlex.preds, paddingBottom: 100, alignItems: 'center' }}>
        {
          (model === null) ?
            <AnimatedLoader
              visible={true}
              overlayColor="rgba(255,255,255,0.75)"
              source={require("../assets/images/7597-loader-animation.json")}
              animationStyle={{ width: 100, height: 100 }}
              speed={1.5}
            ><Text>Exploring universe, loading model ...</Text></AnimatedLoader>
            :
            (hasPredicted && predictions) ?
              <ChartComponent data={predictions} />
              :
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Hit predict button to see magic</Text>

        }
      </View>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        marginTop: 0,
        paddingTop: 30,
        paddingBottom: 0,
        marginBottom: 0
      }}
      >
        <Button
          icon={<Icon name='arrow-left-bold-circle' color='#ffffff' type='material-community' />}
          buttonStyle={{
            backgroundColor: '#009900',
            borderRadius: 5,
            // marginLeft: 0,
            // marginRight: 0,
            paddingBottom: 5,
          }}
          title='Upload Another'
          onPress={() => navigation.navigate('WhichFlower')} />
        <Button
          icon={<Icon name='arrow-right-drop-circle' color='#ffffff' type='material-community' />}
          buttonStyle={{
            backgroundColor: '#009900',
            borderRadius: 5,
            // marginLeft: 0,
            // marginRight: 0,
            paddingBottom: 5,
          }}
          title='Predict'
          onPress={() => predict()} />
      </View>
    </View>

  )
}