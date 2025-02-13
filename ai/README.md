### cat-eye-detection

#### 필수 설치 라이브러리
```bash
pip install inference-cli
```

#### 환경변수 설정
```bash
export RF_API_URL=<api_url>
export RF_API_KEY=<api_key>
```

#### 예제 응답 (`sample/1.jpg`)
```json
{
  "inference_id": "",
  "time": 0.04207504400073958,
  "image": {
    "width": 500,
    "height": 375
  },
  "predictions": [
    {
      "x": 333.0,
      "y": 141.0,
      "width": 76.0,
      "height": 64.0,
      "confidence": 0.8846404552459717,
      "class": "eye",
      "class_id": 0,
      "detection_id": ""
    },
    {
      "x": 227.0,
      "y": 125.5,
      "width": 64.0,
      "height": 55.0,
      "confidence": 0.8145283460617065,
      "class": "eye",
      "class_id": 0,
      "detection_id": ""
    }
  ]
}
```

