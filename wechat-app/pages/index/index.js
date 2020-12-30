//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    info: {
      name: '沐枫', // 用户姓名
      sex: 1, // 用户姓别 1男， 2女
      votes: 8, // 水滴值 默认为8
      avatar: '../../image/detail-bg.jpg' //用户头像
    },
    rainArr: [28, 63, 5, 902], // 雨滴值 点击收取

    stages: 1, // 成长阶段 1(小树[默认])，中2(中树) ，大3(大树)
    during: 100, // 阶段阈值 1、小树[100以下](during > votes ) ，2、中树[100及以上 并且小于1000](during <= votes && oldest > votes)
    oldest: 1000, // 阶段阈值 3、大树[1000及以上](oldest <= votes )
    plussNum: 1, // 加值数量（默认1）

    pluss: false, // 水滴值+1动画开关
    movetree: true, // 树动画开关
    treemove: false, // 树大小动画类型开关
    wateroff: true, // 浇水动画开关
    watercss: false, // 水壶动画开关
    waterdom: false // 水滴动画开关
  },
  
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    let info = this.data.info;
    info.name = e.detail.userInfo.nickName;
    info.avatar = e.detail.userInfo.avatarUrl;
    this.setData({
      userInfo: e.detail.userInfo,
      info,
      hasUserInfo: true
    })
  },

  // 设置树的大小，恢复动画
  setTree(time = 4000) {
    setTimeout(() => {
      this.setData({
        plussNum: 1,
        pluss: false,
        wateroff: true,      
        watercss: false,
        treemove: false
      });
      // 小树阶段
      if (this.data.during > this.data.info.vote) {
        this.setData({
          stages: 1
        });
      }
      // 中树阶段
      if (this.data.during <= this.data.info.votes && this.data.oldest > this.data.info.votes) {
        this.setData({
          stages: 2
        });
      }
      // 大树阶段
      if (this.data.oldest <= this.data.info.votes) {
        this.setData({
          stages: 3
        });
      }
    }, time);
  },

  // 收取雨滴的动画
  rainFun(e) {
    let { index, value } = e.currentTarget.dataset;
    let info = this.data.info;
    let rainArr = this.data.rainArr;
    info.votes = Number(this.data.info.votes) + (value - 0);
    rainArr.splice(index, 1);
    this.setData({
      plussNum: value,
      info,
      pluss: true,
      treemove: true
    });
    setTimeout(() => {
      this.setData({
        rainArr
      });
    }, 1000);
    this.setTree(2000);
  },

  // 点击树的动画
  tree() {
    if (this.data.movetree) {
      this.setData({
        treemove: true,
        movetree: false
      });
      setTimeout(() => {
        this.setData({  
          movetree: true,
          treemove: false
        });
      }, 1000);
    };
  },

  // 水壶浇水动画
  water() {
    if (this.data.wateroff) {
      this.setData({
        watercss: true,
        wateroff: false
      });
      setTimeout(() => {
        this.setData({
          waterdom: true
        });
      }, 1500);
      setTimeout(() => {
        let info = this.data.info;
        info.votes = Number(this.data.info.votes) + 1;
        this.setData({
          info,
          pluss: true,
          treemove: true,
          movetree: false
        });
      }, 2000);
      setTimeout(() => {
        this.setData({
          waterdom: false,
          movetree: true
        })
      }, 3500);
      this.setTree();
    };
  },
})