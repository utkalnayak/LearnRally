 Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
            
            launch: function() {
                console.log("Our second app");
            //create container
            this.pullDownContainer = Ext.create('Ext.container.Container', {
                       layout: {
                       type: 'hbox',
                       align: 'stretch'
                       },
            });
            this.add(this.pullDownContainer);
            
            //this._loadData();
			this._loadIterations();
            },
            
            _loadIterations: function(){
            this.iterCombo = Ext.create('Rally.ui.combobox.IterationComboBox',{
                   listeners: {
                       ready: function(combobox){
                       
                        //this._loadData();
                        this._loadState();
                       },
                        
                        select: function(combobox, records){
                            this._loadData();
                        },
                       scope: this
                       }
                   });
            this.pullDownContainer.add(this.iterCombo);
            },
            
            _loadState: function(){
            this.stateCombo = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
                            model: 'UserStory',
                            field: 'ScheduleState',
                             listeners: {
                             ready: function(combobox){
                             
                             this._loadData();
                             
                             },
                             
                             select: function(combobox, records){
                             this._loadData();
                             },
                             scope: this
                             }
                    });
            this.pullDownContainer.add(this.stateCombo);
            
            },
            
            _loadData: function(){
            var selectedIter = this.iterCombo.getRecord().get('_ref');
            var selectedState = this.stateCombo.getRecord().get('value');
            console.log('selected State --', selectedState);
            console.log('selected iteration : ',selectedIter);

            var storyFilters = [
                               {
                               property: 'Iteration',
                               operation: '=',
                               value: selectedIter
                               },
                               {
                               property: 'ScheduleState',
                               operation: '=',
                               value: selectedState
                               }
                                ];
            
            if(this.userStoryStore){
            
                this.userStoryStore.setFilter(storyFilters);
                this.userStoryStore.load();
            }else{
                this.userStoryStore = Ext.create('Rally.data.wsapi.Store', {
                                                 model: 'User Story',
                                                 autoLoad: true,
                                                 filters: storyFilters,
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
            

