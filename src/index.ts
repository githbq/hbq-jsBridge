/**
* entry
*/


export default class JsBridge {
  // hbqJsBridge 方法名统一前缀 
  private jsBridgePrefix = 'hbqJsBridge'
  // 前端事件执行完，通知native的统一事件名
  private nativeReceiveEventName = 'hbqNativeReceiveEvent'
  // 普通请求回调事件挂载对象
  private callbacks = {}
  // 事件请求回调挂载对象
  private events = {}
  // jsEngine 名, iOS为 webkit
  public jsEngine = 'webkit'
  // 一个自增的序列每次发起调用时增加一个值
  private id = 0
  constructor (options) {
    if (!(this instanceof JsBridge)) {
      return new JsBridge(options)
    }
    window[`${this.jsBridgePrefix}Receive`] = this.receive

  }

  /**
   * 向native发起调用
   * @param name 
   * @param data 
   * @param callback 
   */
  invoke(name, data, callback?) {
    const handler = window[this.jsEngine].messageHandlers[name]
    if (!handler) {
      return this
    }

    handler.postMessage({ ...data, callbackId: ++this.id })

    if (callback) {
      this.callbacks[this.id] = callback
    }
    return this
  }
  /**
   * 接收native的回调,前端不需要调用此方法,由native方调用
   * @param reponse 
   */
  receive(response) {
    const { eventName, callbackId, responseId, data } = response
    if (callbackId) {
      this.callbacks[callbackId] && this.callbacks[callbackId]()
    } else if (eventName) {
      const result = this.emit(eventName, data)
      this.invoke(this.nativeReceiveEventName, { result, responseId })
    }
  }
  /**
   * 由native触发web端的事件时执行
   * @param name 
   * @param options 
   * @returns 返回事件执行的结果 
   */
  emit(name, options) {
    if (!this.events[name]) { return this }
    const totalResult = {}
    this.events[name].forEach(callback => {

      const result = callback(options)
      Object.assign(totalResult, result)
    })
    return totalResult
  }
  /**
   * 添加事件绑定供native调用
   * @param name 事件名
   * @param callback 
   */
  on(name, callback) {
    if (!name || !callback) return
    this.events[name] = this.events[name] || []
    this.events[name].push(callback)
    return this
  }
  /**
   * 移除事件绑定
   * @param name 
   * @param callback 
   */
  off(name, callback) {
    if (!name || !this.events[name]) return this
    if (!callback) {
      delete this.events[name]
      return this
    }
    const callbacks = []
    this.events[name].forEach((n) => {
      if (this.events[name] !== callback) {
        callbacks.push(n)
      }
    })
    this.events[name] = callbacks
    return this
  }
}