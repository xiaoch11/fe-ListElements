function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

function extend(defaultOptions, options) {
    var option;
    for (option in defaultOptions) {
        if (options.hasOwnProperty(option)) {
            if (isObject(defaultOptions[option])&&isObject(options[option])) {
                extend(defaultOptions[option], options[option]);
            }
        }
        else {
            options[option] = defaultOptions[option];
        }
    }
    return options;
}

function showPagesList(options) {
    var showPages = new Array();
    var left = options.currentPage - options.showSide;
    var right = options.currentPage + options.showSide;
    left = (left > 0) ? left : 1;
    right = (right < options.totalPages) ? right : options.totalPages;
    for (var i = left; i <= options.currentPage; i++) {
        showPages.push(i);
    }
    for (var j = options.currentPage + 1; j <= right; j++) {
        showPages.push(j);
    }
  if(options.showHead) {
    if (left > 1) {
        if (left > 2) {
            showPages.unshift(1, 0); //0表示省略号
        }
        else {
            showPages.unshift(1);
        }
    }
    if (right < options.totalPages) {
        if (right < options.totalPages - 1) {
            showPages.push(0); //0表示省略号
        }
      showPages.push(options.totalPages);
    }
  }
  return showPages;
}

function createPagiBtn(name, innerHTML, state) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('name', name);
    a.href = 'javascript:void(0);';
    if (state) {
        a.className = 'pagi-a-' + state;
    }
    else {
        a.className = 'pagi-a';
    }
    // if ((state && state.match('disabled')) || name == 'btnIgn') {
    //     a.disabled = true;
    // }
    a.innerHTML = innerHTML;
    li.appendChild(a);
    li.className = 'pagi-li';
    return li;
}

function Paginator(options) {
    var defaultOptions = {
        totalPages: 10,
        currentPage: 1,
        showSide: 2,
        showHead: true,
        onPageChange: function() {}
    };
    this.options = extend(defaultOptions, options);
    this.div = null;
}

Paginator.prototype.initPaginator = function(id) {
    console.log('initialize paginator');
    //console.log(this.options);
    var div = document.getElementById(id);
    this.div = div;
    this.div.className = 'paginatorDiv';
    this.setPage(this.options.currentPage);
    this.bindEventListener();
}

Paginator.prototype.setPage = function(page) {
    if (page < 1 || page > this.options.totalPages) {
        console.warn('wrong page:' + page);
    }
    console.log('set page:' + page);
    if (this.options.currentPage != page) {
        this.options.onPageChange(page);
    }
    this.options.currentPage = page;
    //清空div
    while(this.div.hasChildNodes()) {
        this.div.removeChild(this.div.firstChild);
    }
    if (this.options.totalPages == 0) {
        console.log('totalPages=0 --> no paginator');
        return;
    }
    //创建显示列表
    var showPages = showPagesList(this.options);
    //创建DOM结构
    var ul = document.createElement('ul');
    ul.className = 'paginator';
    if (page == 1) {
        var btnPre = createPagiBtn('btnPre', '<', 'leftdisabled');
    }
    else {
        var btnPre = createPagiBtn('btnPre', '<', 'leftside');
    }
    ul.appendChild(btnPre);
    for (var i = 0; i < showPages.length; i++) {
        if (showPages[i] > 0) {
            if (showPages[i] == this.options.currentPage) {
                var btnPage = createPagiBtn('btnPage', showPages[i], 'active');
            }
            else {
                var btnPage = createPagiBtn('btnPage', showPages[i]);
            }
            ul.appendChild(btnPage);
        }
        else {
            var btnIgn = createPagiBtn('btnIgn', '...');
            ul.appendChild(btnIgn);
        }
    }
    if (page == this.options.totalPages) {
        var btnNext = createPagiBtn('btnNext', '>', 'rightdisabled');
    }
    else {
        var btnNext = createPagiBtn('btnNext', '>', 'rightside');
    }
    ul.appendChild(btnNext);
    this.div.appendChild(ul);
}

Paginator.prototype.bindEventListener = function() {
    var paginator = this;
    this.div.addEventListener('click', function(e) {
        if (e.target) {
            var name = e.target.getAttribute('name');   
            console.log(name + " has been clicked.");
            switch (name) {
                case 'btnPre': if(paginator.options.currentPage != 1) { paginator.setPage(paginator.options.currentPage - 1);} break;
                case 'btnNext': if(paginator.options.currentPage != paginator.options.totalPages) {paginator.setPage(paginator.options.currentPage + 1);} break;
                case 'btnIgn': break;
                case 'btnPage': 
                    var page = parseInt(e.target.innerHTML);
                    paginator.setPage(page);
            }
        }
    });
}

function Table(options, data) {
    var defaultOptions = {
        styleClass: 'table_bordered',
        enableSort: false,
        onSort: function() {}
    };
    var defaultHead = {
        name: 'thead',
        showName: 'unknown',
        colspan: 1,
        sortState: 0  //0：未指定排序；1：上升排序；-1：下降排序
    }
  this.options = extend(defaultOptions, options);
  this.head = new Array();
  this.body = data.body;
  this.id = null;
  this.div = null;
  //初始化表头
  var h;
  for (var i = 0; i< data.head.length; i++) {
    var h = data.head[i];
    if (typeof h == 'string') {
        var h_temp = defaultHead;
        h_temp.name = h;
        this.head.push(h_temp);
    }
    else {
        this.head.push(extend(defaultHead, h));
    }
  }
}

Table.prototype.initTable = function(id) {
    console.log('initialize table');
    //console.log(this.options);
    var div = document.getElementById(id);
    this.id = id;
    this.div = div;
    //清空div
    while(this.div.hasChildNodes()) {
        this.div.removeChild(this.div.firstChild);
    }

    if (this.head.length == 0 && this.body.length == 0) {
        var p = document.createElement('p');
        p.innerHTML = '暂无数据';
        this.div.appendChild(p);
    }
    else {
        //创建表格
        var table = document.createElement('table');
        table.className = this.options.styleClass;

        var tr_head = document.createElement('tr');
        tr_head.id = this.id + '-tr_head';
        for (var i = 0; i < this.head.length; i++) {
            var h = this.head[i];
            var th = document.createElement('th');
            th.innerHTML = h.showName;
            //th.className = this.options.styleClass;
            th.setAttribute('name', h.name);
            th.setAttribute('colspan', h.colspan);
            tr_head.appendChild(th);
        }
        table.appendChild(tr_head);

        for (var i = 0; i < this.body.length; i++) {
            var row = this.body[i];
            var tr_body = document.createElement('tr');
            tr_body.id = this.id + '-tr_body-' + i;
            //var row_data;
            for (var j = 0; j < this.head.length; j++) {
                var h = this.head[j];
                var td = document.createElement('td');
                td.innerHTML = row[h.name];
                tr_body.appendChild(td);
            }
            table.appendChild(tr_body);
        }
        this.div.appendChild(table);
    }
}

Table.prototype.updateData = function(data) {
    //this.head = new Array();
    var rowCnt_old = this.body.length;
    var rowCnt_new = data.body.length;
    this.body = data.body;
    if (rowCnt_old == 0) { 
        var tr_blank = document.getElementById(this.id + '-tr_blank');
        this.div.firstChild.removeChild(tr_blank); 
    }
    var index = rowCnt_new > rowCnt_old ?　rowCnt_old : rowCnt_new;
    for (var i = 0; i < index; i++) {
        var row = this.body[i];
        var tr_body = document.getElementById(this.id+'-tr_body-' + i);
        for (var j = 0; j < this.head.length; j++) {
            var h = this.head[j];
            tr_body.childNodes[j].innerHTML = row[h.name];
        }
    }
    if (rowCnt_new > rowCnt_old) {
        for (var i = index; i < rowCnt_new; i++) {
            var row = this.body[i];
            var tr_body = document.createElement('tr');
            tr_body.id = this.id + '-tr_body-' + i;
            for (var j = 0; j < this.head.length; j++) {
                var h = this.head[j];
                var td = document.createElement('td');
                td.innerHTML = row[h.name];
                tr_body.appendChild(td);
            }
            this.div.firstChild.appendChild(tr_body);
        }
    }
    else {
        for (var i = index; i < rowCnt_old; i++) {
            var tr_body = document.getElementById(this.id + '-tr_body-' + i);
            this.div.firstChild.removeChild(tr_body);
        }
        if (rowCnt_new == 0) {
            var colspan = document.getElementById(this.id + '-tr_head').children.length;
            var tr_blank = document.createElement('tr');
            tr_blank.id = this.id + '-tr_blank';
            var td = document.createElement('td');
            td.setAttribute('colspan', colspan);
            td.innerHTML = '暂无数据';
            tr_blank.appendChild(td);
            this.div.firstChild.appendChild(tr_blank);
        }
    }
}

function QueryForm(options, query) {
    var defaultOptions = {
        onSubmit: function() {}
    };
    var defaultQuery_select = {
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
    }
    var defaultQuery_input = {
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
    }
    this.options = extend(defaultOptions, options);
    this.query = new Array();
    for (var i = 0; i < query.length; i++) {
        switch (query[i].type) {
            case 'select': this.query.push(extend(defaultQuery_select, query[i])); break;
            default: this.query.push(extend(defaultQuery_input, query[i])); break;
        }
    }
    this.div = null;
    this.id = null;
    //this.query = query;
}

QueryForm.prototype.initQueryForm = function(id) {
    console.log('initialize queryForm');
    //console.log(this.options);
    var div = document.getElementById(id);
    this.id = id;
    this.div = div;
    //清空div
    while(this.div.hasChildNodes()) {
        this.div.removeChild(this.div.firstChild);
    }
    //创建表单
    var form = document.createElement('form');
    form.className = 'queryForm';

    for (var i = 0; i < this.query.length; i++) {
        var div_child = document.createElement('div');
        div_child.className = 'queryDiv';
        var q = this.query[i];
        var label = document.createElement('label');
        label.innerHTML = q.label;
        label.className = 'queryLabel';
        var input;
        switch (q.type) {
            case 'select': input = createSelect(q); break;
            default: input = createInput(q);
        }
        if (q.required) {
            input.setAttribute('required', 'required');
        }
        if (q.disabled) {
            input.setAttribute('disabled', 'disabled');
        }
        input.id = this.id + '-' + q.name;
        div_child.appendChild(label);
        div_child.appendChild(input);
        form.appendChild(div_child);
    }
    // var query_btn = document.createElement('button');
    // query_btn.id = this.id + '-submit';
    // query_btn.innerHTML = '查询';
    var clear_btn = document.createElement('button');
    clear_btn.id = this.id + '-clear_btn';
    clear_btn.innerHTML = '清除条件';
    clear_btn.className = 'clearBtn';
    form.appendChild(clear_btn);
    var query_btn = document.createElement('input');
    query_btn.setAttribute('type', 'submit');
    query_btn.value = '查询';
    query_btn.className = 'queryBtn';
    form.appendChild(query_btn);

    this.div.appendChild(form);
    this.bindEventListener();
}


QueryForm.prototype.bindEventListener = function() {
    var form = this.div.firstChild;
    var queryForm = this;
    form.addEventListener('submit', function(e) {
        //alert('form submit');
        e.preventDefault();
        if (checkForm(form)) {
            var query = getFormValue(form);
            queryForm.options.onSubmit(query);
        }
    });
    var clear_btn = document.getElementById(this.id + '-clear_btn');
    clear_btn.addEventListener('click', function() {
        queryForm.setFormValue({}, form);
    })
}

QueryForm.prototype.setFormValue = function(values, form) {
    if (values && values.length) {
        var v;
        for (v in values) {
            var input = document.getElementById(this.id + '-' + v);
            input.value = values[v];
        }
    }
    else {
        for (var i = 0; i < form.elements.length-1; i++) {
            var e = form.elements[i];
            if (e.nodeName == 'SELECT') {
                e.value = 'allSelected';
            }
            else if(e.nodeName == 'INPUT'){
                e.value = null;
            }
        }
    }
}

function createSelect(query) {
    var select = document.createElement('select');
    select.setAttribute('name', query.name);
    select.className = 'querySelect';
    // var addition;
    // for (addition in query.additions) {
    //     if (addition != 'options' && addition != 'selected') {
    //         select.setAttribute(addition, query.additions[addition]);
    //     }
    // }
    var option = document.createElement('option');
    option.setAttribute('value', 'allSelected');
    option.innerHTML = '全部';
    option.className = 'queryOption';
    select.appendChild(option);
    for (var i = 0; i < query.additions.options.length; i++) {
        var o = query.additions.options[i];
        option = document.createElement('option');
        option.innerHTML = o.showName;
        option.className = 'queryOption';
        option.setAttribute('value', o.value);
        if (query.additions.selected == o.value) {
            option.setAttribute('selected', 'selected');
        }
        select.appendChild(option);
    }
    return select;
}

function createInput(query) {
    var input = document.createElement('input');
    input.setAttribute('name', query.name);
    input.className = 'queryInput';
    var addition;
    for (addition in query.additions) {
        if (query.additions[addition]) {
            input.setAttribute(addition, query.additions[addition]);
        }
    }
    return input;
}

function checkForm(form) {
    return true;
}

function getFormValue(form) {
    var query = {};
    for (var i = 0; i < form.elements.length-1; i++) {
        var e = form.elements[i];
        if (e.value && (e.value != 'allSelected' || e.nodeName == 'INPUT')) {
            query[e.name] = e.value;
        }
    }
    console.log(query);
    return query;
}