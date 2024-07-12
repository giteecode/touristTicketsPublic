


module.exports = {
  data: {  },
  onShow () { console.log('Log from mixin!') },
  goBack(){
    wx.navigateBack({
      delta:1
    })
  },
 }