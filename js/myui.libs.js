var myui = (function(){ 
    var libs = libs || {};
    //工具
    libs.Utils = (function() {
        var Utils = {
            uniqueid:1
        };
        Utils.unique = function(){

            return ++Utils.uniqueid;
        };        
        Utils.strFormat = function() {
            if (arguments.length == 0)
                return null;
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
            }
            return str;
        };
        Utils.trigger = function(event,params){
            return this.events[event] && this.events.apply(this,params);
        };
        Utils.extendClass = function (subClass, superClass) {
            var F = function() {};

            F.prototype = superClass.prototype;

            subClass.prototype = new F();

            subClass.prototype.constructor = subClass;

            subClass.superclass = superClass.prototype;

            if (superClass.prototype.constructor == Object.prototype.constructor) {
                superClass.prototype.constructor = superClass;
            }
        };
        Utils.extend = function(obj){
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                keys = Object.keys(source || {});
                var l = keys.length;
                for (var i = 0; i < l; i++) {
                  var key = keys[i];
                  obj[key] = source[key];
                }
            }
            return obj;
        }
        Utils.randIntRange = function (begin,end){
            return Math.ceil(Math.random() * (end - begin)) + begin;
        };
        Utils.randInt = function (max){
            return Math.ceil(Math.random() * max);
        };
        Utils.arrayContains = function(array,data){
            for (var i = 0; i < array.length; i++) {
                if(array[i] == data)
                {
                    return true;
                }
            };
            return false;
        };
        Utils.arrayIndexOf = function(array,data){
            for (var i = 0; i < array.length; i++) {
                if(array[i] == data)
                {
                    return i;
                }
            };
            return -1;
        };
        Utils.arrayFind = function(array,predicate){
            for (var i = 0; i < array.length; i++) {
                var data = array[i];
                if(predicate && predicate(data))
                {
                    return data;
                }
            };
            return null;
        };
        Utils.arrayRemove = function(array,data,predicate){
            var find = -1;            
            if(predicate)
            {
                for (var i = 0; i < array.length; i++) {
                    if(predicate && predicate(array[i],data))
                    {
                        find = i;
                    }
                };
            }
            else
            {
                for (var i = 0; i < array.length; i++) {
                    if(array[i] == data)
                    {
                        find = i;
                    }
                }
            }            
            if(find >= 0){
                array.splice(find,1);
            }
        };
        return Utils;
    })();
    //集合
    libs.Collections = (function(){
        var Collections = {};
        //哈希
        function Hashtable() {
            this._datas = {};
            this._count = 0;
        }
        Hashtable.prototype = {
            set: function(key, value) {
                if (!this._datas.hasOwnProperty(key)) {
                    this._count++;
                }
                this._datas[key] = value;
            },
            add: function(key, value) {
                if (this._datas.hasOwnProperty(key)) return false;
                else {
                    this._datas[key] = value;
                    this._count++;
                    return true;
                }
            },
            remove: function(key) {
                delete this._datas[key];
                this._count--;
            },
            contains: function(key) {
                return this.containsKey(key);
            },
            containsKey: function(key) {
                return this._datas.hasOwnProperty(key);
            },
            containsValue: function(value,predicate) {
                if(predicate)
                {
                    for (var prop in this._datas) {
                        if (predicate && predicate(this._datas[prop] , value)) {
                            return true;
                        }
                    }    
                    return false;
                }
                for (var prop in this._datas) {
                    if (this._datas[prop] === value) {
                        return true;
                    }
                }
                return false;
            },
            keys: function() {
                var keys = [];
                for (var prop in this._datas) {
                    keys.push(prop);
                }
                return keys;
            },
            values: function() {
                var values = [];
                for (var prop in this._datas) {
                    values.push(this._datas[prop]);
                }
                return values;
            },
            count: function() {
                return this._count;
            },
            item: function(key) {
                if (this.contains(key))
                    return this._datas[key];
                else
                    return undefined;
            },
            key: function(value,predicate) {
                if(predicate)
                {
                    for (var prop in this._datas) {
                        if (predicate && predicate(this._datas[prop] , value)) {
                            return prop;
                        }
                    }    
                    return undefined;
                }
                for (var prop in this._datas) {
                    if (this._datas[prop] === value) {
                        return prop;
                    }
                }
                return undefined;
            },
            clear: function() {
                delete this._datas;
                this._datas = {};
                this._count = 0;
            },
            toString: function() {
                return JSON.stringify(this._datas);
            }
        };
        function List(){
            this._datas = [];
        }
        List.prototype = {
            set: function(key, value) {
                this._datas[key] = value;
            },
            add: function(value) {
                this._datas[this._datas.length] = value;
            },
            remove: function(key) {
                this._datas.splice(key,1);
            },
            find:function(predicate){
                if(typeof predicate === 'function')
                {
                    var count = this._datas.length;
                    for (var i = 0; i < count; i++) {
                        var data = this._datas[i];
                        if (predicate && predicate(data)) {
                            return data;
                        }
                    };
                    return null;                 
                }
                return this._datas[predicate];
            },
            indexOf: function(value,predicate){
                if(predicate)
                {
                    var count = this._datas.length;
                    for (var i = 0; i < count; i++) {
                        if (predicate && predicate(this._datas[i] , value)) {
                            return i;
                        }
                    };                   
                    return -1;
                }
                for (var i = 0; i < count; i++) {
                    if (this._datas[i] === value) {
                        return i;
                    }
                }
                return -1;
            },
            contains: function(value,predicate) {
                if(predicate)
                {
                    var count = this._datas.length;
                    for (var i = 0; i < count; i++) {
                        if (predicate && predicate(this._datas[prop] , value)) {
                            return true;
                        }
                    };                   
                    return false;
                }
                for (var i = 0; i < count; i++) {
                    if (this._datas[prop] === value) {
                        return true;
                    }
                }
                return false;
            },
            count: function() {
                return this._datas.length;
            },           
            clear: function() {
                this._datas = [];
            },
            toString: function() {
                return JSON.stringify(this._datas);
            }
        };
        Collections.Hashtable = Hashtable;
        Collections.List = List;
        return Collections;
    })();
    //分页
    libs.DataPager = (function () {
        function Pager(options){
            this.pageIndex = options.pageIndex || 1;
            this.pageSize = options.pageSize || 10;
            this.totalSize = options.totalSize || 0;
            this.datas = options.datas || [];
            this.options = options;
        }
        Pager.prototype = {
            setCurPage:function(pageIndex,pageSize,totalSize){
                this.pageIndex = pageIndex != null ? ~~pageIndex || 1 : this.pageIndex;
                this.pageSize = pageSize != null ? ~~pageSize || 1 : this.pageSize;
                this.totalSize = totalSize;
            },
            getPageTotal:function(){
                var totalPage = ~~(this.totalSize / this.pageSize) + (this.totalSize % this.pageSize == 0 ? 0 : 1);
                totalPage = totalPage > 0 ? totalPage : 1;
                return totalPage;
            },
            getData:function (datas,action) {
                if(datas && datas.length > 0){
                    return Pager.page(datas,this.pageIndex,this.pageSize,action);    
                }
                return Pager.page(this.datas,this.pageIndex,this.pageSize,action);
            }
        }
        Pager.page = function(datas,pageindex,pagesize,action){
            var begin = (pageindex - 1) * pagesize;            
            var total = datas.length;
            var end = begin + pagesize;
            begin = begin > 0 ? begin : 0;
            end =  total > end ? end : total;
            var result = [];
            for (; begin < end; begin++) {
                var data = datas[begin];
                result.push(data);
                action && action(begin,data);
            };
            return result;
        }
        return Pager;
    })();
    libs.DataScroller = (function(){
        function Scroller(options){
            this.rowIndex = options.rowIndex || 0;
            //用于表示页面最大容纳个数
            this.pageSize = options.pageSize || 10;     
            //用于显示个数
            this.displaySize = options.displaySize || options.pageSize || 10;       
            this.totalSize = options.totalSize || 0;
            this.datas = options.datas || [];
            this.options = options;
        }
        Scroller.prototype = {
            setCurPos:function(rowIndex,displaySize,totalSize){                
                this.rowIndex = rowIndex != null ? rowIndex || 0 : this.rowIndex;                
                this.displaySize = displaySize != null ? displaySize || 10 : this.displaySize;
                this.totalSize = totalSize || 0;
            },
            getData:function (datas,act) {
                if(datas && datas.length > 0){
                    return Scroller.scroll(datas,this.rowIndex,this.displaySize,act);    
                }
                return Scroller.scroll(this.datas,this.rowIndex,this.displaySize,act);
            }
        }
        Scroller.scroll = function(datas,rowIndex,displaySize,act){
            var begin = rowIndex;
            var total = datas.length;
            var end = begin + displaySize;
            begin = begin > 0 ? begin : 0;
            end =  total > end ? end : total;
            var result = [];
            for (; begin < end; begin++) {
                var data = datas[begin];
                result.push(data);
                act && act(begin,data);
            };
            return result;
        }
        return Scroller;
    })();
    //数据管理
    libs.DataViewer = (function() {
        var Hashtable = libs.Collections.Hashtable,
        List = libs.Collections.List,
        Utils = libs.Utils;       

        //Model管理类
        function DataManager(options) {
            //业务列表 key:num,value:DataModel
            this.hashs = new Hashtable();
            this.datas = [];
            //视图适配器
            this.adapter = options.adapter || new DefaultAdapter(),
            //排序字段
            this.sortFields = [];
            //model的主键名称
            this.modelKey = options.modelKey || 'key';
            //model名称
            this.modelName = options.modelName || 'model';
            //名称
            this.name = options.name ||'DataManager';
            this.options = options;
        };

        DataManager.prototype = {
            //清理
            clear: function() {
                this.hashs.clear();
                this.datas = [];
                this.adapter && this.adapter.clear && this.adapter.clear();
            },
            begin:function () {
                this.adapter && this.adapter.switch(false);
            },
            end:function () {
                this.adapter && this.adapter.switch(true);
                this.adapter && this.adapter.sort && this.adapter.sort();
                this.adapter && this.adapter.refresh && this.adapter.refresh();
            },
            //统计个数
            count: function() {
                return this.datas.length;
            },
            //根据modelKey找到客户端
            findData: function(key) {
                return this.hashs.item(key);
            },                        
            //添加
            appendData: function(data) {
                this.datas.push(data);
                this.hashs.add(data[this.modelKey], data);
                this.adapter && this.adapter.append && this.adapter.append(data);
            },
            //添加一组
            appendDatas: function(datas) {
                var used = this.hashs.count();
                var count = datas.length || 0;
                for (var i = 0; i < count; i++) {
                    var data = datas[i];
                    this.hashs.add(data[this.modelKey], data);
                    this.datas.push(data);
                    this.adapter && this.adapter.append && this.adapter.append(data);
                }                
            },
            //更新考试机
            updateData: function(data) {                
                var that = this;
                if (data == null) {
                    return;
                }                
                Utils.arrayRemove(this.datas,data,function(left,right){
                    return left[that.modelKey] == right[that.modelKey];
                });                
                this.hashs.set(data[this.modelKey], data);
                this.datas.push(data);
                this.adapter && this.adapter.update && this.adapter.update(data);
            },
            //更新
            updateDatas: function(datas) {
                if (datas == null) {
                    return;
                }
                var that = this;
                var count = datas.length;
                for (var i = 0; i < count; i++) {
                    var data = datas[i];
                    Utils.arrayRemove(this.datas,data,function(left,right){
                        return left[that.modelKey] == right[that.modelKey];
                    });                
                    this.hashs.set(data[this.modelKey], data);
                    this.datas.push(data);
                    this.adapter && this.adapter.update && this.adapter.update(data);
                }
            },
            //删除
            removeData: function(data) {
                var that = this;
                Utils.arrayRemove(this.datas,data,function(left,right){
                    return left[that.modelKey] == right[that.modelKey];
                });                
                this.hashs.remove(data[this.modelKey]);
                this.adapter && this.adapter.remove && this.adapter.remove(data);
            },
            //判断是否存在
            containsData: function(data) {
                if (!data) return false;
                if (!data[this.modelKey]) return false;
                var exist = this.hashs.item(data[this.modelKey]);
                return !exist;
            },
            //判断是否存在
            containsKey: function(modelKey) {
                if (!modelKey) return false;
                return this.hashs.contains(modelKey);
            },            
                
        }

        //默认视图
        function DefaultView() {
            this.adapter = null;
        }

        DefaultView.prototype = {
            //初始化view
            initialize: function(adapter) {
                this.adapter = adapter;
            },
            //视图domid
            viewId:function(data,viewIndex){
                return Utils.strFormat('{0}_{1}', this.adapter.modelName, viewIndex);
            },
            //渲染头部
            renderHead: function() {
                return '<h1>默认试图</h1>';
            },
            //渲染主题部分
            renderBody: function(data,viewIndex) {
                return ['<div id="', this.viewId(data,viewIndex), '">', JSON.stringify(data), '</div>'].join('')
            },
            //渲染尾部
            renderFoot: function() {
                return ['<footer>总计', this.adapter.manager.count(), '条数据</footer>'].join('');
            },
            //渲染空
            renderEmpty:function(){
                return this.options.emptyText || '';
            },
            //刷新
            refresh: function(data,viewIndex) {
                $('#' + this.viewId(data,viewIndex)).html(JSON.stringify(data));
                this.bindEvents();
            },
            //绑定view事件
            bindEvents: function() {
                this.events.onbindevents && this.events.onbindevents();
            },
            events: {
                onbindevents: null
            }
        };

        //观察者
        function DefaultWatcher () {
            this.adapter = null;
        }

        DefaultWatcher.prototype = {
            attach:function(adapter){
                this.adapter = adapter;
            },
            detach:function(){
                this.adapter = null;
            },
            watchData:function(allDatas){
                return allDatas;
            }
        }

        //适配器，数据和视图关联
        function DefaultAdapter(){
            //视图
            this.view = null;
            //数据管理
            this.manager = null;
            //观察者
            this.watcher = null;
            //view-data映射关系  key:viewIndex,value:datas Key
            this.dataList = new List();
            this.datas = [];
            //页面容器
            this.container = null;
            //状态
            this.status = [];
            //数据
            this.datas = [];
            this.delay = true;
            this.sortFields = [];
        }

        DefaultAdapter.prototype = {
            //初始化,DefaultAdapter.initialize({ modelKey : 'key' , container : $('.ui-content') , view: new DefaultView() });
            initialize: function(options,mgr,view,watcher) {
                this.options = options;  
                this.name = options.name || 'DefaultAdapter';                
                this.modelName = options.modelName || mgr.options.modelName || 'model';
                this.container = options.container || $('.ui-content');
                this.modelKey = options.modelKey || mgr.options.modelKey || 'key';                             
                this.container.empty();
                this.manager = mgr;
                this.watcher = watcher;
                this.watcher && this.watcher.attach(this);
                this.setView(view);                
            },
            //清理
            clear:function(){
                this.watcher && this.watcher.unBindEvents && this.watcher.unBindEvents();
                this.view && this.view.unBindEvents && this.view.unBindEvents();
                this.dataList.clear();
                this.datas = [];
                this.refresh();                
            },
            //事件
            events: {
                onbindmenu: null,
                onunbindmenu: null,
                onrefreshed: null,
                ondefaultsort: null
            },
            //设置渲染方式
            setView: function(view) {                
                if (view) {
                    if(this.view)
                    {
                        this.container.removeClass(this.view.viewname);
                        if (this.status && this.status.length > 0) {
                            for (var i = 0; i < this.status.length; i++) {                            
                                this.container.removeClass('{0}-{1}'.format(this.view.viewname,this.status[i]));
                            }                        
                        }
                    }
                    this.events.onunbindmenu && this.events.onunbindmenu();
                    this.view = view;
                    this.view.initialize(this);
                    this.container.addClass(this.view.viewname);
                    if (this.status && this.status.length > 0) {
                        for (var i = 0; i < this.status.length; i++) {                            
                            this.container.addClass('{0}-{1}'.format(this.view.viewname,this.status[i]));
                        }
                    }
                    this.sort();
                    this.refresh();
                    this.events.onbindmenu && this.events.onbindmenu();
                }
            },
            //添加状态
            pushStatus:function(status){
                if(Utils.arrayContains(this.status,status)) return;
                this.status.push(status);
            },
            //删除状态
            popStatus:function(status){
                var index = Utils.arrayIndexOf(this.status,status);
                if(index < 0) return;
                this.status.splice(index,1);
            },
            switch:function (flag) {
                this.delay = flag;
            },
            append:function(data){
                this.dataList.add(data);
                this.datas.push(data);
                this.sort();
                this.refresh();
            },
            update:function(data){
                var that = this;
                var key = this.dataList.indexOf(data,function(left,right){ return left[that.modelKey] == right[that.modelKey]; });
                this.dataList.set(key,data);
                this.refreshKey(key);
                Utils.arrayRemove(this.datas,data,function(left,right){
                    return left[that.modelKey] == right[that.modelKey];
                });
                this.datas.push(data);
            },
            remove:function(data){
                var that = this;
                var key = this.dataList.indexOf(data,function(left,right){ return left[that.modelKey] == right[that.modelKey]; });
                this.dataList.remove(key);
                Utils.arrayRemove(this.datas,data,function(left,right){
                    return left[that.modelKey] == right[that.modelKey];
                });
                this.refresh();
            },
            //禁用所有排序
            disableSortFields: function() {
                var count = this.sortFields.length;
                for (var i = 0; i < count; i++) {
                    var field = this.sortFields[i];
                    field.enable = false;
                    field.order = '';
                }
            },
            //清理所有排序
            clearSortFields: function() {
                this.sortFields = [];
            },
            //根据名称获取排序
            getSortField: function(name) {
                if (!name) return;
                var count = this.sortFields.length;
                for (var i = 0; i < count; i++) {
                    var field = this.sortFields[i];
                    if (field.name === name) {
                        return field;
                    }
                }
            },
            //切换sortFiled
            toggleSortField:function(name,single){
                if (!name) return;
                var count = this.sortFields.length;
                for (var i = 0; i < count; i++) {
                    var field = this.sortFields[i];                    
                    if (field.name === name) {
                        if(field.enable)
                        {
                            field.order = field.order == 'asc' ? 'desc' : 'asc';
                        }   
                        else
                        {
                            field.order = 'asc';
                        }                         
                        field.enable = true;
                    }
                    else
                    {
                        if(single){
                            field.enable = false;
                        }
                    }
                }
            },
            //设置排序字段
            setSortField: function(name, change) {
                if (!name) return;
                var count = this.sortFields.length;
                var find = false;
                for (var i = 0; i < count; i++) {
                    var field = this.sortFields[i];
                    if (field.name === name) {
                        this.sortFields[i] = change;
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    this.sortFields.push(change);
                }
            },
            //根据字段优先级
            getSortFields: function() {
                var keys = [];
                var sortFields = this.sortFields;
                var count = sortFields.length;
                for (var i = 0; i < count; i++) {
                    if (sortFields[i].enable) {
                        keys.push(sortFields[i]);
                    }
                }
                keys.sort(function(a, b) {
                    return a.level > b.level ? -1 : 1;
                });
                return keys;
            },
            //返回排序后的dataList
            sort: function(datas) {
                if(!this.delay){return;}
                var that = this;
                var sortFields = this.getSortFields();
                var count = sortFields.length;
                var sortdata = (datas && datas.length > 0) ? datas : this.datas;
                sortdata.sort(function(dataA, dataB) {
                    //没有设置排序字段,默认座位号升序
                    if (count == 0) {
                        if (that.events.ondefaultsort) {
                            return that.events.ondefaultsort(dataA, dataB);
                        } else {
                            var propA = dataA[that.modelKey];
                            var propB = dataB[that.modelKey];
                            return propA && propB && (propA.toString().localeCompare(propB.toString())) * (order === 'asc' ? 1 : -1);
                        }
                    }
                    //设置了排序字段
                    for (var i = 0; i < count; i++) {
                        var field = sortFields[i];
                        var prop = field.name;
                        var props = prop.split('.');
                        var type = field.type;
                        var order = field.order;
                        var depth = props.length;

                        var aProp = dataA;
                        var bProp = dataB;
                        for (var j = 0; j < depth; j++) {
                            aProp = aProp[props[j]];
                            aProp = aProp || {};
                        }
                        for (var j = 0; j < depth; j++) {
                            bProp = bProp[props[j]];
                            bProp = bProp || {};
                        }
                        aProp = aProp || '';
                        bProp = bProp || '';
                        if (!prop) {
                            continue;
                        }
                        if (aProp === bProp) {
                            if (i === count - 1) return 0;
                            continue;
                        }
                        if (type === 'number') {
                            var result = (~~aProp > ~~bProp ? 1 : -1) * (order === 'asc' ? 1 : -1);
                            return result;
                        } else {
                            var result = (aProp.toString().localeCompare(bProp.toString())) * (order === 'asc' ? 1 : -1);
                            return result;
                        }
                    }
                    return 0;
                });
            },
            //获取渲染方式
            getViewName: function() {
                return this.view ? this.view.viewname : '';
            },
            //根据视图index找客户端
            findDataOfView: function(viewIndex) {
                return this.dataList.find(viewIndex);
            },
            //重新生成视图，重新生成DOM
            refresh: function() {
                if(!this.delay){return;}
                var view = this.view;
                if(!view){return;}
                var views = [];
                this.watcher && this.watcher.unBindEvents && this.watcher.unBindEvents();
                this.view && this.view.unBindEvents && this.view.unBindEvents();
                var datas = this.watcher ? this.watcher.watchData(this.datas) : this.datas;
                var count = this.datas.length;
                views.push(this.view.renderHead());
                this.dataList.clear();
                if(datas.length == 0) { views.push(this.view.renderEmpty()); }
                for (var i = 0; i < datas.length; i++) {
                    var data = datas[i];
                    views.push(this.view.renderBody(data,i));
                    this.dataList.add(data);
                }
                views.push(this.view.renderFoot());
                this.container.html(views.join(''));
                this.events.onrefreshed && this.events.onrefreshed();
                this.view && this.view.bindEvents && this.view.bindEvents();
                this.watcher && this.watcher.bindEvents && this.watcher.bindEvents();
            },
            //刷新所有Data,不重新生成DOM
            refreshData: function() {
                this.watcher && this.watcher.unBindEvents && this.watcher.unBindEvents();
                this.view && this.view.unBindEvents && this.view.unBindEvents();
                var view = this.view;
                var count = this.dataList.count();
                for (var i = 0; i < count; i++) {
                    var data = this.findDataOfView(i);
                    this.view.refresh(data,i);
                }
                this.view && this.view.bindEvents && this.view.bindEvents();
                this.watcher && this.watcher.unBindEvents && this.watcher.unBindEvents();
            },
            //刷新单个Data
            refreshKey: function(key) {
                var that = this;
                var data = this.dataList.find(key);                
                this.view.refresh(data,key);
            }
        }

        //对外接口
        var DataViewer = {};
        DataViewer.DataManager = DataManager;
        DataViewer.DefaultAdapter = DefaultAdapter;
        DataViewer.DefaultView = DefaultView;
        DataViewer.DefaultWatcher = DefaultWatcher;           
        DataViewer.create = function(options) {
            var manager = new DataManager(options);
            var view = options.view || new DefaultView();
            var watcher = options.watcher || new DefaultWatcher();
            var adapter = options.adapter || new DefaultAdapter(); 
            options.adapter = adapter;
            adapter.initialize(options,manager,view,watcher);
            return manager;
        }
        return DataViewer;
    })();   
    libs.SlotAdapter = (function(){
        function SlotAdapter(){
            this.adapters = [];
        }
        SlotAdapter.prototype = {
            //初始化,DefaultAdapter.initialize({ modelKey : 'key' , container : $('.ui-content') , view: new DefaultView() });
            initialize: function(options,mgr,view,watcher) {
                this.adapters.forEach(function (adapter) {
                    adapter.initialize(options,mgr,view,watcher);
                });
            },
            attach:function(adapter){
                if(libs.Utils.arrayContains(this.adapters,adapter)){return;}
                this.adapters.push(adapter);
            },
            detach:function(adapter){
                libs.Utils.arrayRemove(this.adapters,adapter);
            },
            //清理
            clear:function(){
                this.adapters.forEach(function (adapter) {
                    adapter.clear();
                });
            },
            //事件
            events: {
                onbindmenu: function(){
                    this.adapters.forEach(function (adapter) {
                        adapter.events.onbindmenu && adapter.events.onbindmenu();
                    });
                },
                onunbindmenu: function () {
                    this.adapters.forEach(function (adapter) {
                        adapter.events.onunbindmenu && adapter.events.onunbindmenu();
                    });
                },
                onrefreshed: function () {
                    this.adapters.forEach(function (adapter) {
                        adapter.events.onrefreshed && adapter.events.onrefreshed();
                    });
                },
                ondefaultsort: function () {
                    this.adapters.forEach(function (adapter) {
                        adapter.events.ondefaultsort && adapter.events.ondefaultsort();
                    });
                }
            },
            //添加状态
            pushStatus:function(status){
                this.adapters.forEach(function (adapter) {
                    adapter.pushStatus(status);
                });
            },
            //删除状态
            popStatus:function(status){
                this.adapters.forEach(function (adapter) {
                    adapter.popStatus(status);
                });
            },            
            switch:function (flag) {
                this.adapters.forEach(function (adapter) {
                    adapter.switch(flag);
                });
            },
            append:function(data){
                this.adapters.forEach(function (adapter) {
                    adapter.append(data);
                });
            },
            update:function(data){
                this.adapters.forEach(function (adapter) {
                    console.log(1);
                    adapter.update(data);
                });
            },
            remove:function(data){
                this.adapters.forEach(function (adapter) {
                    adapter.remove(data);
                });
            },
            //排序
            sort:function(){
                this.adapters.forEach(function (adapter) {
                    adapter.sort();
                });
            },
            //重新生成视图，重新生成DOM
            refresh: function() {
                this.adapters.forEach(function (adapter) {
                    adapter.refresh();
                });
            },
            //刷新所有Data,不重新生成DOM
            refreshData: function() {
                this.adapters.forEach(function (adapter) {
                    adapter.refreshData();
                });
            },
            //刷新单个Data
            refreshKey: function(key) {
                this.adapters.forEach(function (adapter) {
                    adapter.refreshKey(key);
                });
            }
        }        
        return SlotAdapter;
    })();
    return libs;
})();
