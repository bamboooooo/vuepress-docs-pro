# API接入协议

[[toc]]

## 接口说明

1、构建成功并发布上线的对话流，可以通过API实现人机之间按照设计好的交互逻辑进行持续，双向，自然地沟通。

2、接口调用所需参数`chatflow_id`（对话流唯一标识）和`apiKey`（接口秘钥）由iFLYOS 对话流平台提供，调用方管理。

3、调用方可以根据需要重置`apiKey`，以确保秘钥安全。

::: warning 注意

- 只有在iFLYOS 对话流平台申请发布并审核通过的对话流，才能通过此API协议进行接入。

::: 



## 接口地址

```text
POST https://chatflow.iflyos.cn/app/ HTTP/1.1
```



## API说明

1. 授权认证，调用接口需要将 `CurTime`, `Param` 和 `CheckSum` 信息放在 HTTP 请求头中；
2. 接口统一为 UTF-8 编码；
3. 接口支持 http 和 https；
4. 请求方式为POST。



## 授权认证

在调用接口时，需要在 Http Request Header 中配置以下参数用于授权认证：

| 参数<img width=100/>       | 格式<img width=100/>    | 说明                                                         | 必须<img width=100/>  |
| ---------- | ------ | ------------------------------------------------------------ | ---- |
| X-CurTime  | string | 当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数     | 是   |
| X-Param    | string | 相关参数JSON串经Base64编码后的字符串，见各接口详细说明       | 是   |
| X-CheckSum | string | 令牌，计算方法：MD5(apiKey + curTime + param)，三个值拼接的字符串，进行MD5哈希计算（32位小写），其中apiKey由iFLYOS 对话流平台提供，调用方管理。 | 是   |

*注：*

- apiKey：接口密钥，由iFLYOS 对话流平台提供，调用方管理；
- checkSum 有效期：出于安全性考虑，每个 checkSum 的有效期为 5 分钟(用 curTime 计算)，同时 curTime 要与标准时间同步，否则，时间相差太大，服务端会直接认为 curTime 无效；
- BASE64 编码采用 MIME 格式，字符包括大小写字母各26个，加上10个数字，和加号 + ，斜杠 / ，一共64个字符。

*checkSum *生成示例：

```javascript
String apiKey="abcd1234"; 
String curTime="1502607694";
String param="eyAiYXVmIjogImF1ZGlvL0wxNjtyYXR...";
String checkSum=MD5(apiKey+curTime+param);
```



## 请求参数

在 Http Request Header 中配置授权认证参数，见【授权认证】。 其中 *X-Param* 为各配置参数组成的 JSON 串经 BASE64 编码之后的字符串，原始 JSON 串各字段说明如下：



| JSON字段<img width=100/>    | 类型<img width=100/>   | 必须 | 说明                                                         | 示例<img width=200/>                             |
| ----------- | ------ | ---- | ------------------------------------------------------------ | -------------------------------- |
| chatflow_id | string | 是   | 对话流唯一标识                                               | 202988d20e5d4c7aa7ba1a4a64ab9d8f |
| auth_id  | string | 是   | 用户唯一ID（32位字符串，包括英文小写字母与数字，开发者需保证该值与终端用户一一对应） | 2049a1b2fdedae553bd03ce6f4820ac4 |
| data_type   | string | 是   | 数据类型，可选值：text（文本），audio（音频）                | text                             |
| test | boolean | 否 | 是否为测试调用，如果不传则默认为正式调用 | true |
| sample_rate | string | 否   | 音频采样率，可选值：16000（16k采样率）、8000（8k采样率），默认为16000 | 16000                            |
| aue         | string | 否   | 音频编码，可选值：raw（未压缩的pcm或wav格式）、speex（speex格式，即sample_rate=8000的speex音频）、speex-wb（宽频speex格式，即sample_rate=16000的speex音频），默认为 raw | raw                              |
| speex_size  | string | 否   | speex音频帧大小，speex音频必传。详见speex_size与speex库压缩等级关系表 | 60                               |

*X-Param生成示例：*

原始JSON串：

```json
{
  "chatflow_id":"202988d20e5d4c7aa7ba1a4a64ab9d8f",
  "data_type":"text",
  "uid":"2049a1b2fdedae553bd03ce6f4820ac4"
}
```

BASE64编码（即X-Param）：

```text
eyJjaGF0RmxvdyI6IjIwMjk4OGQyMGU1ZDRjN2FhN2JhMWE0YTY0YWI5ZDhmIiwiZGF0YVR5cGUiOiJ0ZXh0IiwidWlkIjoiMjA0OWExYjJmZGVkYWU1NTNiZDAzY2U2ZjQ4MjBhYzQifQ==
```

在 Http Request Body 中配置以下参数：

将音频/文本的二进制字节数组放入请求body中，数据长度限制为：音频文件大小 < 2MB, 时长 < 60s （其中 speex 音频大小 < 512KB）, 文本长度 < 2000B

## 返回值

返回结果为 JSON 字符串，各字段说明如下：

| JSON字段 | 类型   | 说明                 |
| -------- | ------ | -------------------- |
| code     | string | 结果码(具体见错误码) |
| data     | array  | 结果数据             |
| desc     | string | 描述                 |
| sid      | string | 会话ID               |

其中 sid 字段主要用于追查问题，如果出现问题，可以提供 sid 给讯飞技术人员帮助确认问题。

### data 字段说明

| JSON字段  | 类型   | 说明                                 |
| --------- | ------ | ------------------------------------ |
| content   | object | 语义理解，识别和回复等结果 |
| result_id | number | 结果序号，同一业务逐渐递增           |

### content 说明

结果示例
```json
{
  "directives": [
    {
      "payload": {
        "qa": false,
        "template": "{phone}",
        "rc": 0,
        "score": 1.0,
        "slots": [
          {
            "name": "phone",
            "value": "12345",
            "normValue": "12345"
          }
        ],
        "text": "12345",
        "intent": "huazhu_phone",
        "version": "1.0",
        "sid": "atn199c35f1@dx000710f89878782d01"
      },
      "header": {
        "namespace": "Custom",
        "name": "Semantic"
      }
    },
    {
      "payload": {
        "chatStop": false,
        "data": "您好，我是智能机器人华小AI，请问您要预定哪个省哪个市的酒店？",
        "type": "text"
      },
      "header": {
        "namespace": "SpeechSynthesizer",
        "name": "SpeakText"
      }
    }
  ]
}
```

字段说明

| JSON字段 | 类型   | 说明               |
| -------- | ------ | ------------------ |
| directives     | array | 数组中的每一个对象分别为语义理解、识别和回复等结果|

directives 中对象说明：

| JSON字段 | 类型   | 说明               |
| -------- | ------ | ------------------ |
| header     | object | 标识结果类型|
| header.namespace     | string | 结果的命名空间|
| header.name     | string | 结果的类型名字|
| payload     | object | 结果数据|

语义理解结果说明：

语义理解结果的的namespace为Custom，name为Semantic，payload字段说明如下：

| JSON字段 | 类型   | 说明               |
| -------- | ------ | ------------------ |
| qa     | boolean | 是否为qa，保留字段|
| template     | string | 语料模板|
| rc     | int | 语义理解服务返回码|
| slot     | object | 语义理解的槽位信息|
| text     | string | 语义理解的输入文本|
| intent     | string | 意图|
| version     | string | 语义理解的版本|
| sid     | string | 语义理解服务返回的sid，用于追踪语义理解服务的调用链路|

识别结果说明：

语义理解结果的的namespace为Custom，name为Asr，payload字段说明如下：

| JSON字段 | 类型   | 说明               |
| -------- | ------ | ------------------ |
| sn     | number | 第几句|
| ls     | boolean | 是否最后一句|
| bg     | number | 开始|
| ed     | number | 结束|
| ws     | array | 词|
| cw     | array | 中文分词|
| w     | string | 单字|
| sc     | number | 分数|

回复结果说明：

回复结果的的namespace为SpeechSynthesizer，name为SpeakText，payload字段说明如下：

| JSON字段 | 类型   | 说明               |
| -------- | ------ | ------------------ |
| type     | string | 回复类型：文本（text），H5（h5），音频（audio）|
| data     | string | 回复数据，h5时为链接，audio时base64压缩后的音频|
| chatStop     | boolean | 此次回复以后，对话流是否结束|


## 错误码

| 错误码<img width=100/> | 描述<img width=200/>              | 说明                 | 处理方式                                   |
| ------ | ----------------- | -------------------- | ------------------------------------------ |
| 0      | success           | 成功                 |                                            |
| 10100 | bad_request | 通用错误请求 | 根据错误描述进行判断处理 |
| 10105       | illegal access    | 没有权限             | 检查apiKey，ip，checkSum等授权参数是否正确 |
| 10106    | invalid parameter | 无效参数或参数值为空 | 上传必要的参数， 检查参数格式以及编码      |
| 10107       | illegal parameter | 非法参数值           | 检查参数值是否超过范围或不符合要求         |
| 10108 | not_published | 对话流未发布 | 申请发布并等待审核通过 |
| 10109 | illegal_data_length | 数据长度非法 | 检查传递的音频和文本是否超过长度 |
| 10110 | no_license | 无授权许可 |  |
| 10111 | exceed_free_count | 超过免费调用次数 | |
| 10114 | time_out | 超时 |                                            |
| 10301 | parse_data_error | 解析数据错误 |                                            |
| 20001 | flow_json_parse_error | flow配置json解析错误 |                                            |
| 20002 | load_chatflow_config_error | 加载chatFlow配置信息错误 |                                            |
| 30001 | no_node_error | 配置节点未发现 |                                            |
| 30002 | no_enter_node_error | 未发现Enter节点 |                                            |
| 30005 | execute_script_error | 执行脚本错误 | 检查脚本是否正确 |
| 30008 | no_match_rule | 未匹配上任何规则 | 检查判断条件判断配置 |
| 30012 | http_request_error | 调用第三方接口错误 | 检查http节点的配置是否正确 |
| 40003 | request_nlu_timeout | 请求语义理解服务超时 |  |
| 40004 | request_asr_timeout | 请求识别服务超时 |  |



## 调用示例

> java程序调用示例

**说明**：需要将代码中的 CHATFLOW_ID、API_KEY参数替换成平台已发布对话流的 chatflow_id 及对应的 apiKey。

``` java

package com.iflytek.flow.demo;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * iFLYOS 对话流平台 API调用示例
 * <p>
 * 运行方法：直接运行 main()
 * <p>
 * 结果： 控制台输出接口返回值信息
 *
 * @author iflyos_chatflow
 */
public class WebApiDemo {
    private static final String URL = "https://chatflow.iflyos.cn/app/";
    private static final String CHATFLOW_ID = "";
    private static final String API_KEY = "";
    private static final String AUTH_ID = "12345";
    private static final String QUERY_TEXT = "帮我订下酒店";

    public static void main(String[] args) throws IOException {
        Map<String, String> header = buildHeader();
        String result = httpPost(URL, header, QUERY_TEXT);
        System.out.println(result);
    }

    /**
     * 按照API协议构造请求头
     *
     * @return
     * @throws UnsupportedEncodingException
     */
    private static Map<String, String> buildHeader() throws UnsupportedEncodingException {
        String curTime = String.valueOf(System.currentTimeMillis() / 1000);

        //必传请求参数
        String param = "{\"auth_id\":\"" + AUTH_ID + "\",\"data_type\":\"text\",\"chatflow_id\":\"" + CHATFLOW_ID + "\"}";
        //BASE64 编码
        String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
        //令牌
        String checkSum = DigestUtils.md5Hex(API_KEY + curTime + paramBase64);

        //Request Header
        Map<String, String> header = new HashMap<String, String>();
        header.put("X-CurTime", curTime);
        header.put("X-Param", paramBase64);
        header.put("X-CheckSum", checkSum);

        return header;
    }

    /**
     * post请求
     *
     * @param url
     * @param header
     * @param body
     * @return
     */
    private static String httpPost(String url, Map<String, String> header, String body) {
        String result = "";
        BufferedReader in = null;
        OutputStream out = null;
        try {
            URL realUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
            for (String key : header.keySet()) {
                connection.setRequestProperty(key, header.get(key));
            }
            connection.setDoOutput(true);
            connection.setDoInput(true);

            //connection.setConnectTimeout(20000);
            //connection.setReadTimeout(20000);
            try {
                out = connection.getOutputStream();
                out.write(body.getBytes());
                out.flush();
            } catch (Exception e) {
                e.printStackTrace();
            }

            try {
                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = in.readLine()) != null) {
                    result += line;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
```
