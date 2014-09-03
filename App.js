Ext.define('CustomApp', {
           extend: 'Rally.app.App',
           componentCls: 'app',
           
           items: [
                   {
                   xtype: 'container',
                   itemId: 'pulldown-container',
                   layout:
                   {
                   type: 'hbox',
                   align: 'stretch'
                   }
                   }
                   ],
           
           launch: function() {
           console.log("Our second app");
           this._loadIterations();
           },
           
           _loadIterations: function(){
           var iterCombo = Ext.create('Rally.ui.combobox.IterationComboBox',{
                                      itemId: 'iteration-combo',
                                      listeners: {
                                      ready: this._loadState,
                                      select: this._loadData,
                                      scope: this
                                      }
                                      });
           this.down('#pulldown-container').add(iterCombo);
           
           },
           
           
           _loadState: function(){
           var stateCombo = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
                                       itemId: 'state-combo',
                                       model: 'UserStory',
                                       field: 'ScheduleState',
                                       listeners: {
                                       ready: this._loadData,
                                       select: this._loadData,
                                       scope: this
                                       }
                                       });
           this.down('#pulldown-container').add(stateCombo);
           },
           
           
           _getFilters: function(selectedIter, selectedState){
           var storyFilter = Ext.create('Rally.data.wsapi.Filter', {
                                        property: 'Iteration',
                                        operation: '=',
                                        value: selectedIter
                                        });
           
           var stateFilter = Ext.create('Rally.data.wsapi.Filter', {
                                        property: 'ScheduleState',
                                        operation: '=',
                                        value: selectedState
                                        });
           
           return storyFilter.and(stateFilter);
           },
           
           
           
           _loadData: function(){
           var selectedIter = this.down('#iteration-combo').getRecord().get('_ref');
           var selectedState = this.down('#state-combo').getRecord().get('value');
           console.log('selected State --', selectedState);
           console.log('selected iteration : ',selectedIter);
           
           var filtersApplied = this._getFilters(selectedIter, selectedState);
           
           if(this.userStoryStore){
           
           this.userStoryStore.setFilter(filtersApplied);
           this.userStoryStore.load();
           }else{
           this.userStoryStore = Ext.create('Rally.data.wsapi.Store', {
                                            model: 'User Story',
                                            autoLoad: true,
                                            filters: filtersApplied,
                                            listeners: {
                                            load: function(myStore, myData, success) {
                                            //process data
                                            console.log('data found',myStore, myData, success);
                                            if(!this.myGrid){
                                            this._createGrid(myStore);
                                            }
                                            },
                                            scope: this
                                            },
                                            fetch: ['FormattedID','Name', 'ScheduleState']
                                            });
           }
           },
           
           
           
           
           _createGrid: function(myLocalStore) {
           this.myGrid = Ext.create('Rally.ui.grid.Grid',
                                    {
                                    store: myLocalStore,
                                    columnCfgs: [
                                                 'FormattedID',
                                                 'Name',
                                                 'ScheduleState'
                                                 ]
                                    });
           this.add(this.myGrid);
           console.log('Whose context is this? :',this);
           
           
           }
           });


