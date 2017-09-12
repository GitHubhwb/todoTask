angular.module('todo',[])
  .controller('todoCtrl',['$scope',function($scope){
    /*
    获取数据
     */
    $scope.taskList=[];
    GetTasks();
    function GetTasks(){
      if(localStorage.getItem('taskList')){
        //angular.fromJson  将json字符串转换成js对象
        $scope.taskList=angular.fromJson(localStorage.getItem('taskList'));
      }
    }
  	/*

  	1.获取用户输入的任务名字
  	2.准备一个任务列表
  	3.监听输入的回车事件
  	4.将任务添加到任务列表
  	5.利用ng-repeat 指令将任务列表展示到页面
  	 */
  	
  	$scope.addTask=function(event){
  		//如果用户按的是回车键 并且 文本框中有内容
      if(event.keyCode==13 && $scope.task){
      	//将用户输入的任务名字添加到数组中
      	$scope.taskList.push({
      		name:$scope.task,
      		isCompleted:false,
          isEditing:false //代表当前任务是否处于编辑状态
      	});
      	//清空文本框
      	$scope.task='';
        //把数据存到本地   localStorage只能存字符串  angular.toJson将js对象转换成json对象
       localStorage.setItem('taskList', angular.toJson($scope.taskList));
      }
  	}

  	/*
  	删除任务
  	1.给删除按钮添加点击事件
  	2.把要删除的任务传递到事件函数中
  	3.删除任务
  	 */
  	$scope.destroyTask=function(task){
      //splice(index,1)
      $scope.taskList.splice($scope.taskList.indexOf(task),1);
  	}
  	/*
  	计算未完成任务的数量
    filter  对数组内容和进行过滤
    item 当前循环项
  	 */
  	$scope.unCompletedTaskNum=function(){
  		return $scope.taskList.filter(function(item){
           return !item.isCompleted;
  		}).length;
  		
  	}
    
    //all active completed  状态
    $scope.select='All';//默认选中
    $scope.filterData=function(type){
      switch(type){
        case 'All':
          $scope.filterType='';
          $scope.select='All';
          break;
        case 'Active':
          $scope.filterType=false;//未选中状态
          $scope.select='Active';
          break;
        case 'Completed':
          $scope.filterType=true;//选中状态
          $scope.select='Completed';
          break;
      }
    }

    /*
    清除已完成任务
    对数组的数据进行过滤  过滤掉未完成的剩下就是已完成的
     */
    $scope.clearCompleted=function(){
      $scope.taskList=$scope.taskList.filter(item=>!item.isCompleted);
    }
    
    /*
    全选和反选

     */
    $scope.changeStatus=function(){
      $scope.taskList.forEach(item=>item.isCompleted= $scope.status );
      
    }
    $scope.updateStatus=function(){
      // for(var i=0;i<$scope.taskList.length;i++){
      //   if(!$scope.taskList[i].isCompleted){
      //     $scope.status=false;
      //     return;
      //   }
      // }
      // $scope.status=true;
      // 如果未完成任务的数量为0 说明都完成了  高亮显示
      $scope.status=$scope.taskList.filter(item=>!item.isCompleted).length==0;
    }
  
    /*
      更改任务名字

     */
    $scope.modifyTaskName=function(task){
      //所有的任务列表取消编辑状态
      $scope.taskList.forEach(item=>item.isEditing=false);
      //当前双击的任务的选中
      task.isEditing=true;
    }
    //离开焦点取消编辑状态
    $scope.cancelEditing=function(){
        $scope.taskList.forEach(item=>item.isEditing=false);
    }
    $scope.$watch('taskList',function(){
        localStorage.setItem('taskList', angular.toJson($scope.taskList));
      },true)
  }])
  .directive('inpFocus',['$timeout',function($timeout){
    return {
      restrict:'A',
      link:function(scope,element,attribute){
        // $watch 可以监听数据变化  就会执行回调函数  页面一上来就会执行一次
        scope.$watch('item.isEditing',function(newValue){
           if(newValue){
            //进入事件队列，最后执行
            $timeout(function(){
              element[0].focus();
            },0)
            
           }
        })
      }
    }
  }])