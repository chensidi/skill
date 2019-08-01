import axios from 'axios'
export default {
 wxShowMenu : function() {
 axios.post('http://test.youxue.pxjy.com/wxtest').then(function(res){
  var getMsg = res.data.data;
  wx.config({
  debug: false,  //����������Ҫ�ر�debugģʽ
  appId: getMsg.appId, //appIdͨ��΢�ŷ���ź�̨�鿴
  timestamp: getMsg.timestamp, //����ǩ����ʱ���
  nonceStr: getMsg.noncestr, //����ǩ��������ַ���
  signature: getMsg.signature, //ǩ��
  jsApiList: [ //��Ҫ���õ�JS�ӿ��б�
   'onMenuShareTimeline', //���������
   'onMenuShareAppMessage', //��������Ȧ
   'showMenuItems',
   'hideMenuItems'
  ]
  });
  wx.ready(function() {
  wx.checkJsApi({
   jsApiList: ["showMenuItems"],
   success: function(res) {
    wx.showMenuItems({
     menuList: [
      'menuItem:share:appMessage', //���͸�����
      'menuItem:share:timeline' //��������Ȧ
     ]
    });
   }
  });
  //��������Ȧ
  wx.onMenuShareTimeline({
   title: "��������", // �������
   desc: "��������", //��������
   link: getMsg.shareLink,// ��������
   imgUrl: getMsg.imgUrl // ����ͼ��
  });
  //���������
  wx.onMenuShareAppMessage({
   title: "��������", // �������
   desc: "��������", // ��������
   link: getMsg.shareLink, // ��������
   imgUrl: getMsg.imgUrl // ����ͼ��
  });
  });
 })
 }
}