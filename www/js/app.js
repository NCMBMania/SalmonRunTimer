$(function() {
  const applicationKey = 'YOUR_APPLICATION_KEY';
  const clientKey = 'YOUR_CLIENT_KEY';
  const senderId  = 'YOUR_SENDER_ID';
  const ncmb = new NCMB(applicationKey, clientKey);
  
  $('#workTime').val(strftime('%Y/%m/%d %H:%M', new Date()));
  
  const pushRefresh = () => {
    ncmb.Push
      .notEqualTo('status', 2)
      .fetchAll()
      .then((pushes) => {
        let html = [];
        for (let i = 0; i < pushes.length; i += 1) {
          let push = pushes[i];
          let date = new Date(push.deliveryTime.iso);
          html.push(`
          <div class="col-xs-3 action">
            <span class="remove" data-objectId="${push.objectId}">休む
          </div>
          <div class="col-xs-9 time">
            ${strftime('%Y年%m月%d日 %H:%M', date)}
          </div>
          `);
        }
        $('.works').html(html.join(''));
      });
  };
  pushRefresh();
  
  $(document).on('click', '.remove', (e) => {
    const objectId = $(e.target).data('objectid');
    const push = new ncmb.Push();
    push.objectId = objectId;
    push
      .delete()
      .then((e) => {
        pushRefresh();
      });
  });
  
  $('.addWork').on('click', (e) => {
    e.preventDefault();
    const push = new ncmb.Push();
    const date = new Date($('#workTime').val());
    console.log(date);
    push
      .set('message', 'さぁ、今日もバイトを頼まれてくれるかな🐻')
      .set('sound', 'www/s2.caf')
      .set('target', ['ios', 'android'])
      .set('deliveryTime', date)
      .send()
      .then((e) => {
        pushRefresh();
      })
      .catch((err) => {
        alert(`エラーです ${JSON.stringify(err)}`);
      })
  });
  
  // プッシュ通知受信時のコールバックを登録します
  window.NCMB.monaca.setHandler (
    function(jsonData){
      // 送信時に指定したJSONが引数として渡されます
      alert("callback :::" + JSON.stringify(jsonData));
    }
  );
  
  window.NCMB.monaca.setDeviceToken(
    applicationKey,
    clientKey,
    senderId,
    function() {
      getInstallationId();
    },
    function() {
      
    }
  );
  
  window.NCMB.monaca.setReceiptStatus(true);
  
  
},false);

function getInstallationId() {
  // 登録されたinstallationのobjectIdを取得します。
  window.NCMB.monaca.getInstallationId(function(id) {
    
  });
}
