/**
 * Utility functions for tensorflow
 */


const xywh2x1y1x2y2 = (tf, xywh) => {
    const [x, y, w, h] = tf.split(xywh, 4, -1)
    const x1 = tf.sub(x, tf.div(w, tf.scalar(2.0)))
    const y1 = tf.sub(y, tf.div(h, tf.scalar(2.0)))
    const x2 = tf.add(x, tf.div(w, tf.scalar(2.0)))
    const y2 = tf.add(y, tf.div(h, tf.scalar(2.0)))
    const result = tf.concat([x1, y1, x2, y2], 1)
    return result
  }

  export const nonMaxSuppressionYolo =  async (tf, preds, iouThreshold = 0.45, scoreThreshold = 0.25) => {
    const boxes = xywh2x1y1x2y2(tf, preds.slice([0, 0], [-1, 4]))  // predicted boxes
    const probas = preds.slice([0, 4], [-1, 1])  //objectness proba
    const classes = preds.slice([0, 5], [-1, 1])  // classes proba
    const scores = tf.mul(probas, classes).squeeze()
    // get selected boxes indices
    const maxOutputSize = 100
    const nms_boxes = await tf.image.nonMaxSuppressionAsync(
      boxes,
      scores,
      maxOutputSize,
      iouThreshold,
      scoreThreshold
    )

    //  get boxes from NMS
    return tf.gather(boxes, nms_boxes)
  }