# 基于原生JS的列表组件

## Paginator--分页组件

### 默认参数

```
totalPages: 10,  //总页码数
currentPage: 1,  //当前选择页码
showSide: 2,     //选择页码两侧显示的页码数
showHead: true,  //是否显示首尾页码
onPageChange: function(page) {} //换页时触发函数
```

### API

```
Paginator(options)           //创建对象

paginator.initPaginator(id)  //与<div>绑定并初始化

paginator.setPage(page)      //设置页码
```

### 使用示例

```
var p = new Paginator({  //创建Paginator对象
   totalPages: 20,
   currentPage: 1,
   onPageChange: function(page) {
       // get data
       console.log(page);
   }
});

p.initPaginator('paginator');  //将Paginator与id为'paginator'的<div>绑定并实例化

p.setPage(10); //设置页码
```

## Table--表格组件

### 默认参数

```
styleClass: 'table_bordered',  //设置表格风格（目前仅支持'table_bordered'-有边框的表格）
enableSort: false,             //是否开启列排序功能（目前不支持开启排序）
onSort: function(head) {}      //排序时触发函数
```

### 默认表头设置

```
name: 'thead',          //列名称
showName: 'unknown',    //列显示标题
colspan: 1,             //列占宽
sortState: 0            //列排序状态--0：未指定排序；1：上升排序；-1：下降排序
```

### API

```
Table(options, data)    //创建对象

table.initTable(id)     //与<div>绑定并初始化

table.updateData(data)  //更新表格数据（不更换表头）
```

### 使用示例

```
var data = {
    head: [{name:'provinceName', showName:'省'}, {name:'cityName', showName:'市'} ],
    body: [{provinceName:'四川', cityName:'成都'}, {provinceName:'重庆', cityName:'重庆'}]
};

var t = new Table({}, data);

t.initTable('table');

var newData  = {
    head: [{name:'provinceName', showName:'省'}, {name:'cityName', showName:'市'} ],
    body: [{provinceName:'重庆', cityName:'重庆'}]
};

t.updateData(newData);
```

## QueryForm--表单组件

### 默认参数

```
onSubmit: function(params) {}   //提交触发函数
```

### 默认Input框参数

```
label: '楼盘名称',
name: 'proj_name',
type: 'input',
required: false,
disabled: false,
additions: {
    maxlength: null,
    max: null,
    min: null,
    pattern: null,
    placeholder: null,
    type: 'text'
}
```

### 默认Select框参数

```
label: '省份',
name: 'provinceId',
type: 'select',
required: false,
disabled: false,
additions: {
    options: [
        {value: '0', showName: '北京'},
        {value: '1', showName: '上海'},
        {value: '2', showName: '重庆'}
    ],
    selected: null
}
```

### API

```
QueryForm(options, query)    //创建对象

queryForm.initQueryForm(id)  //与<div>绑定并初始化
```

### 使用示例

```
var queryInputs = [{type:'select', additions:{}}, {type:'input', required:true, additions:{type:'text', maxlength:10, pattern:'[0-9]'}}];

var q = new QueryForm({
    onSubmit: function(params) { //get data }
}, queryInputs);

q.initQueryForm('queryForm');
```