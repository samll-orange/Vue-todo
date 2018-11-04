;(function() {
    'use strict';

    var Event = new Vue();

    var alert_sound = document.getElementById('alert-sound');

    function copy (obj) {
        return Object.assign({}, obj);
    }

    Vue.component('task', {
        template: "#task-tpl",
        props: ['todo'],
        methods: {
            action: function (name, params) {
                Event.$emit(name, params);
            }
        }
    })
    //实例一个vue
    new Vue({
        el: '#main',
        data: {
            list: [],
            last_id: 0,
            current: {}
        },

        //把数据挂载出来
        mounted: function () {
            var me = this;
            this.list = ms.get('list') || this.list;
            this.last_id = ms.get('last_id') || this.last_id;

            //每隔1秒检测一下时间
            setInterval(function () {
                me.check_alerts();//检查当前是否有提醒的任务
            }, 1000);

            Event.$on('remove', function (id) {
                if(id) {
                    me.remove(id);
                }
            }),
            Event.$on('toggle_complete', function (id) {
                if(id) {
                    me.toggle_complete(id);
                }
            }),
            Event.$on('set_current', function (id) {
                if(id) {
                    me.set_current(id);
                }
            }),
            Event.$on('toggle_detail', function (id) {
                if(id) {
                    me.toggle_detail(id);
                }
            })
        },

        methods: {
            check_alerts: function () {
                var me = this;
                this.list.forEach(function (row, i) {//传入每一条 + 索引
                    var alert_at = row.alert_at;
                    if (!alert_at || row.alert_confirmed) return;
                    var alert_at = (new Date(alert_at)).getTime();//传入了一个固定的时间，获取设定时间的时间戳
                    // alert_at.getTime();//获取时间戳，一串数字，单位ms
                    var now = (new Date()).getTime();

                    if(now >= alert_at) {
                        alert_sound.play();
                        var confirmed = confirm(row.title);
                        Vue.set(me.list[i], 'alert_confirmed', confirmed)
                    }
                 })
            },
            merge: function () {
                var is_update, id;
                is_update = id = this.current.id;

                if (is_update) {
                    var index = this.find_index(id);
                    //使用vue可以检测到的语法
                    Vue.set(this.list, index, copy(this.current));
                    // this.list[index] = copy(this.current);
                    // console.log('this.list:', this.list);
                } else {
                    var title = this.current.title;
                    if(!title && title !== 0) return;
                    var todo = copy(this.current);
                    this.last_id ++;
                    ms.set('last_id', this.last_id)
                    todo.id = this.last_id;
                    this.list.push(todo);
                }

                this.reset_current();
                // console.log('this.list', this.list);
            },

            toggle_detail: function (id) {
                //通过id找到索引
                var index = this.find_index(id);
                Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail);
            },

            //使用索引会因为排序和增删而发生变化，危害性比较大
            remove: function (id) {
                var index = this.find_index(id);
                this.list.splice(index, 1);
            },

            next_id: function () {
                return this.list.length + 1;
            },

            set_current: function (todo) {
                this.current = copy(todo);
            },

            reset_current: function () {
                this.set_current({});
            },

            find_index: function (id) {
                return this.list.findIndex(function(item) {
                    return item.id == id;
                })
            },

            toggle_complete: function (id) {
                var i = this.find_index(id);
                Vue.set(this.list[i], 'completed', !this.list[i].completed);
            }
        },

        //vue的方法--有微小的变动就执行下面的语句
        watch: {
            list: {
                deep: true,
                handler: function (new_val, old_val) {
                    if(new_val){
                        ms.set('list', new_val);;
                    } else {
                        ms.set('lsit', []);
                    }
                }
            }
        }
    })
}())
