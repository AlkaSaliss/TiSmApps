import React, { useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Image, Icon, Text, Button } from 'react-native-elements'
import { decodeJpeg } from '@tensorflow/tfjs-react-native'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native'
import targets from '../assets/models/targets.json'
import { ModelsContext } from '../utils/ModelsContext'


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

  const [predictions, setPredictions] = useState(null)
  const [hasPredicted, setHasPredicted] = useState(false)
  const { data } = route.params
  const inputSize = [224, 224]

  const { tf, whichFlowerModel } = useContext(ModelsContext)

  const predict = () => {

    if (!hasPredicted) {

      const bufferData = Buffer.from(data.base64, 'base64')
      const imageData = new Uint8Array(bufferData)
      const imageTensor = decodeJpeg(imageData)
      const imageTensorResized = tf.image.resizeBilinear(imageTensor, inputSize,)
        .expandDims(0)
        .div(255.0)
      const result = whichFlowerModel.predict(imageTensorResized).mul(100).round().dataSync()
      const resultData = targets.map((item, i) => ({ ...item, value: result[i] }))

      setPredictions(resultData)
      setHasPredicted(!hasPredicted)
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
          (hasPredicted && predictions) ?
            <ChartComponent data={predictions} />
            :
            <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop: 50 }}>Hit predict button {'&'} let magic happen!</Text>
        }
      </View>
      <View style={styles.buttonsContainer}
      >
        <Button
          icon={<Icon name='arrow-left-bold-circle' color='#ffffff' type='material-community' />}
          buttonStyle={styles.buttonStyle}
          title='Upload Another'
          onPress={() => navigation.navigate('WhichFlower')} />
        <Button
          icon={<Icon name='arrow-right-drop-circle' color='#ffffff' type='material-community' />}
          buttonStyle={styles.buttonStyle}
          title='Predict'
          onPress={() => predict()} />
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#009900',
    borderRadius: 5,
    paddingBottom: 5,
    height: 35,
    width: 150
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 0,
    paddingTop: 30,
    paddingBottom: 0,
    marginBottom: 10
  }
})
