(function() {
  'use strict';

  angular.module('app')
    .controller('DashboardController', DashboardController);

  function DashboardController(User,Keenio) {
    var vm = this;

    Keenio.tempQuery( function(err,res){
      if(err) {
        console.log('error in keenio.tempQuery callback',err);
      } else {
        //res is the result of a keen.io query made in keenio.service
        $("#chart-01").val(res).trigger('change');
      }
    });

    Keenio.humidityQuery( function(err,res){
      if(err) {
        console.log('error in keenio.humidityQuery callback',err);
      } else {
        $("#chart-02").val(res).trigger('change');
      }
    });

    Keenio.lightQuery( function(err,res){
      if(err) {
        console.log('error in keenio.lightQuery callback',err);
      } else {
        $("#chart-03").val(res).trigger('change');
      }
    });

    Keenio.soundQuery( function(err,res){
      if(err) {
        console.log('error in keenio.soundQuery callback',err);
      } else {
        $("#chart-04").val(res).trigger('change');
      }
    });

    Keenio.lightTriggerQuery();
    Keenio.soundTriggerQuery();
    Keenio.tempTimelineQuery();
    Keenio.humidityTimelineQuery();
    Keenio.soundTimelineQuery();
    Keenio.lightTimelineQuery();


  }
})();
