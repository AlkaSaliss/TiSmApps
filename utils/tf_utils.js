// import * as tf from '@tensorflow/tfjs'
// import '@tensorflow/tfjs-react-native'


// const convert_xywh2wx1y1x2y2 = (xywh) => {
//   const [x, y, w, h] = tf.split(xywh, 4, -1)
//   const x1 = x - w / 2
//   const y1 = y - h / 2
//   const x2 = x + w / 2
//   const y2 = y + h / 2
//   const result = tf.concat([x1, y1, x2, y2], axis = -1)
//   return result
// }

// const non_max_suppression_tf = (preds, iou_threshold = 0.45, score_threshold = 0.25) => {
//   const boxes = convert_xywh2wx1y1x2y2(preds.slice([0, 0], [-1, 4]))
//   const probas = preds.slice([0, 4], [-1, 5])
//   const classes = preds.slice([0, 5], [-1, -1])
//   const scores = (probas * classes).squeeze()
//   const nms_boxes = tf.NonMaxSuppressionV5(boxes, scores, maxOutputSize=100,
//     iouThreshold=iou_threshold,
//     scoreThreshold=score_threshold)

//   return tf.gather(boxes, nms_boxes)
// }

