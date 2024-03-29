# 常见问题解答

## 上下文变量和全局变量有什么区别？

##### 上下文变量

上下文变量是session对象里定义的节点变量（参考全局上下文部分的介绍）。

session里的上下文变量，包括一些内置的通用变量，如session.query、session.nlu、session.slots节点下的变量。此外也支持开发者自定义节点，例如我们在处理天气业务流程时，需要保存查询城市和基本天气数据，可以自定义下面的上下文变量：

| 自定义节点                     | 类型   | 初始值 | 含义     |
| ------------------------------ | ------ | ------ | -------- |
| session.weatherdata.tempLow    | Int    | 0      | 最低温度 |
| session.weatherdata.tempHigh   | Int    | 0      | 最高温度 |
| session.weatherdata.weather    | String | 晴     | 天气     |
| session.weatherdata.airQuality | String | 优     | 空气质量 |
| session.location.query_city    | String | 北京   | 查询城市 |

上下文变量的取值不固定：随着对话流的执行，一些上下文变量值会随之更新。



##### 全局变量

在对话流的多个节点里往往需要引用一些共同的变量，例如在云函数节点的脚本里或者在回复话术模板里的变量引用。这些变量可以定义为全局变量。

全局变量的取值是固定的，在对话流执行的过程中全局变量的值保持不变。例如下图中定义了针对节假日的定制回复语，可以在需要处理的脚本的直接引用这两个变量。

 ![global_var1](./file/global_var1.png)

 

另外，也可以将一些session的节点名称定义为全局变量，例如下图定义一个全局变量city，取值session.location.query_city，相当于给query_city字段取了一个别名，city字段保持对session.location.query_city的固定引用。

![global_var2](./file/global_var2.png)
