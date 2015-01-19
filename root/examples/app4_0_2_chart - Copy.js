/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop',
    'Ext.data.*',
    'Ext.chart.*',
    'Ext.util.Point'	
]);
 
var mappanel, tree,chartPannel;
var ol3d;
var map2d,store;


Ext.application({

    name: 'OL3EXT4',

    launch: function () {

        mappanel = Ext.create('Ext.panel.Panel', {

            title: "Test Map",

            layout: 'fit',
			
			region: "center",

            html: "<div id='test-map'></div>", // The map will be drawn inside
			tbar: [
						/* {
							text: "remove",
							handler: function() {														
								map2d.removeLayer(map2d.getLayers().getArray()[2]);
							}
						}, {
							text: "add",
							handler: function() {
								map2d.addLayer(layer);
							}
						}, */
						{
							text: "3D",
							border:true,
							
							//handler: function() {
					        handler: function() {
                                //ol3dflag = !ol3d.getEnabled();
								console.log('3dclicked-handler');
								//ol3d.setEnabled(!ol3d.getEnabled());
								
/* 								 if(ol3d.getEnabled())
								 {
								 scene = ol3d.getCesiumScene();
								 var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(
									Cesium.Cartesian3.fromDegrees(102.5883991, 26.2960083, 0.0));
								 var model = scene.primitives.add(Cesium.Model.fromGltf({
									url: 'data/SampleData/models/Hoover/HooverDamtunnelsdetailedDebug.gltf',
									modelMatrix: modelMatrix,
									scale: 5.0
								  }));
								  } */
								  
							},
							
							listeners: {
							  click: function() {
								console.log('3dclicked-clicklistener');
                           
					         /*    var scene = ol3d.getCesiumScene();
					            var terrainProvider = new Cesium.CesiumTerrainProvider({
								  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
								});
					           scene.terrainProvider = terrainProvider;		 */				
					          	
                               ol3d.setEnabled(!ol3d.getEnabled());		
                               console.log(ol3d.getEnabled());							   
								

							  }								
							} 
							
						}],

            listeners: {

                //afterrender: function () {
                  afterrender: function () {

 		            var layer0 = new ol.layer.Tile({
						  title: 'BingMaps',						  
						  source: new ol.source.BingMaps({
							// Get your own key at http://bingmapsportal.com/
							// Replace the key below with your own.
							key: 'AhaJDO_bWhekq58C0nGLRkwJSMphRFDTYeccozENkqZTAAa1W0OgoaWmcgbPxatZ',
							imagerySet: 'AerialWithLabels'
							})
					});	
					
					
					var layer1 = new ol.layer.Tile({
					   title: 'OpenStreetMap',					  
					   opacity: 0.7,
					   source: new ol.source.OSM()
					  });
					  
	  
	
					var layer2 = new ol.layer.Vector({
						title: 'Earthquakes',
						source : new ol.source.GeoJSON({
							projection : 'EPSG:3857',
							url : 'data/geojson/earthquake2000.json'
						}),
						style:new ol.style.Style({
							image: new ol.style.Circle({
							  fill: new ol.style.Fill({
								color: 'rgba(255,255,0,0.5)'
							  }),
							  radius: 5,
							  stroke: new ol.style.Stroke({
								color: '#ff0',
								width: 1
							  })
						  })
						})
						/*style: new ol.style.Style({
							image: new ol.style.Circle({
							  radius: 3,
							  fill: new ol.style.Fill({color: 'yellow'})
							})
						  })*/
					});
                    
					
                    map2d = new ol.Map({

                        target: 'test-map',

                        renderer: 'canvas',

                        //layers: [layer0, new ol.layer.Group({layers: [layer1,layer2]})],
						layers: [layer0,layer1,layer2],

                        view: new ol.View({

                            center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),

                            zoom: 5

                        })
					

                    });
					
					var displayFeatureInfo = function(pixel) {
					  // info.css({
						// left: pixel[0] + 'px',
						// top: (pixel[1] - 15) + 'px'
					  // });
					  var feature = map2d.forEachFeatureAtPixel(pixel, function(feature, layer) {
						return feature;
					  });
					  if (feature) {
					  console.log("displayFeatureInfo");
					  console.log(feature.get('place'));
					  Ext.Msg.alert(feature.get('place'),'Magnitude:'+feature.get('mag') );
					  }
					 /* if (feature) {
						info.tooltip('hide')
							.attr('data-original-title', feature.get('name'))
							.tooltip('fixTitle')
							.tooltip('show');
					  } else {
						info.tooltip('hide');
					  }*/
					};


					map2d.on('click', function(evt) {
					    console.log("map2dClickEvent");
                        console.log(evt.pixel);
						displayFeatureInfo(evt.pixel);
					});
/* 					ol3d = new olcs.OLCesium(map2d ); // map is the ol.Map instance
					var scene = ol3d.getCesiumScene();
					var terrainProvider = new Cesium.CesiumTerrainProvider({
								  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
								});
					scene.terrainProvider = terrainProvider;						
					//ol3d.setEnabled(ol3d.getEnabled());	
                    ol3d.setEnabled(false);						
								 */
		
					 
					

								  
					store = Ext.create('Ext.data.TreeStore', {
						root: {
							text: 'Root',
							expanded: true,
							children: [
								{
									text: map2d.getLayers().getArray()[0].get('title'),
									
									leaf: true
								},
								{
									text: map2d.getLayers().getArray()[1].get('title'),
									leaf: true
								},
								{
									text: map2d.getLayers().getArray()[2].get('title'),
									leaf: true
								}
							]
						}
						});
					console.log("store");
					console.log(store);
						

				
		
			       ol3d = new olcs.OLCesium(map2d); // map is the ol.Map instance
				   var scene = ol3d.getCesiumScene();
				   var terrainProvider = new Cesium.CesiumTerrainProvider({
						  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
						});
					scene.terrainProvider = terrainProvider;
					ol3d.setEnabled(true);

					/* var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(
						Cesium.Cartesian3.fromDegrees(102.5883991, 26.2960083, 0.0));
					var model = scene.primitives.add(Cesium.Model.fromGltf({
						url: 'data/SampleData/models/Hoover/HooverDamtunnelsdetailedDebug.gltf',
						modelMatrix: modelMatrix,
						scale: 5.0
					}));  */

				


	            
                },

                // The resize handle is necessary to set the map!

                resize: function () {

                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];

                    map2d.setSize(size);

                }

            }

        });
		

		var storeChart = Ext.create('Ext.data.TreeStore', {
			model: 'Details',
			fields:['School','wins'],  
			proxy: {
				type: 'ajax',
				url: 'data/geojson/testjson.json',
				reader: {
					root: 'data',
					type: 'json'
				}
			},
			autoLoad: true
		});
		
			var storeChart = Ext.create('Ext.data.Store', {
			model: 'Details',
			fields:['School','wins'],  
			proxy: {
				type: 'ajax',
				url: 'data/geojson/testjson.json',
				reader: {
					root: 'data',
					type: 'json'
				}
			},
			autoLoad: true
		});
		


     
			
		var store2 = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
			root: {
							expanded: true,
							children:  mappanel.layers
				}
        });
		
		var store3 = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
            root: {
				
				text: 'Data',
				expanded: true,
/* 				children: [
				            {
								text: 'BingMaps',
						        leaf: true,
						        checked: true
							},
							{
								text: 'OpenStreetMap',
								leaf: true,
								checked: true,
							
							},
							{
								text: 'Earthquakes',
								leaf: true,
								checked: true
							}
				] */
				children: [
					{
						
						text: 'BaseLayers',
						expanded: true,
						children: [
							{
								text: 'BingMaps',
						        leaf: true,
						        checked: true
							}
						]
						
					},
					{
						text: 'OverlayLayers',
						expanded: true,
						children: [
							{
								text: 'OpenStreetMap',
								leaf: true,
								checked: true,
							
							},
							{
								text: 'Earthquakes',
								leaf: true,
								checked: true
							}
						]
					}
				] 
			}
        });
		

								
		tree = Ext.create('Ext.tree.Panel', {
			            rootVisible: false,
						title: 'Catalog',
						width: 300,
						height: 250,
						border: true,
						region: "west",
						collapsible: true,
						collapseMode: "mini",
						autoScroll: true,
						lines: false,
						useArrows:true,
						
						store: store3,
/* 						tbar: [
						 {
							text: "remove",
							handler: function() {														
								map2d.removeLayer(map2d.getLayers().getArray()[2]);
							}
						}, {
							text: "add",
							handler: function() {
								map2d.addLayer(layer);
							}
						}, 
						{
							text: "3D",
							border:true,
							handler: function() {
					
                                //ol3dflag = !ol3d.getEnabled();
								ol3d.setEnabled(!ol3d.getEnabled());
							}
						}], */
						listeners: {
							  itemclick: function(c, record) {
								// get layer id from clicked row record
								var layerId = record.get('text');
								console.log('itemclick');
                                console.log(layerId);																	
							} ,
							
							checkchange : function(node, checked, opts) {
								var treelayerId = node.get('text');

								
								var layers = map2d.getLayers();
								
								for(i = 0, n = layers.getLength();  i < n; i++) {

								  var layer = layers.getArray()[i];
								   if (layer.get('title') == treelayerId) {
									console.log('getVisible');
									console.log(treelayerId);
									console.log(layer.getVisible())
									layer.setVisible(!layer.getVisible())
									console.log('afterclick');
									console.log(layer.getVisible())
									//layer.setVisible(node.get('checked'));
									break;
								    } 
									
								 }
								 
							}
							
						}

					});	

					

		

		console.log('storeChart');
		console.log(storeChart);

		chartPannel2= Ext.create('Ext.chart.Chart', {
			width: 300,
			height: 250,
			border: true,
			//animate: true,
			region: "east",
			store: storeChart,			
			//collapsible: true,
			//collapseMode: "mini",
			//autoScroll: true,
			//lines: false,
			hidden: false,
			layout: "fit",
			axes: [{
				type: 'Numeric',
				position: 'left',
				fields: ['wins'],
				label: {
					renderer: Ext.util.Format.numberRenderer('0,0')
				},
				title: 'Winning Names',
				grid: true,
				minimum: 0
			}, {
				type: 'Category',
				position: 'bottom',
				fields: ['School'],
				title: 'Sample Metrics'
			}],
			series: [{
				type: 'line',
				highlight: {
					size: 7,
					radius: 7
				},
				axis: 'left',
				xField: 'School',
				yField: 'wins',
				markerConfig: {
					type: 'cross',
					size: 4,
					radius: 4,
					'stroke-width': 0
				}
			}]
		});
			 
		console.log('chartPannel');
		console.log(chartPannel);
		
		var storechartMetric = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
        data: [{
            'name': 'metric one',
            'data1': 10,
            'data2': 12,
            'data3': 14,
            'data4': 8,
            'data5': 13
        }, {
            'name': 'metric two',
            'data1': 7,
            'data2': 8,
            'data3': 16,
            'data4': 10,
            'data5': 3
        }, {
            'name': 'metric three',
            'data1': 5,
            'data2': 2,
            'data3': 14,
            'data4': 12,
            'data5': 7
        }, {
            'name': 'metric four',
            'data1': 2,
            'data2': 14,
            'data3': 6,
            'data4': 1,
            'data5': 23
        }, {
            'name': 'metric five',
            'data1': 4,
            'data2': 4,
            'data3': 36,
            'data4': 13,
            'data5': 33
        }]
    });
	
	
		var chartPannelMetric =  Ext.create('Ext.chart.Chart', {
        //renderTo: Ext.getBody(),
        //width: 500,
        // height: 300,
		title: 'Charts',
		width: 250,
		height: 250,
		border: true,
		region: "east",
		collapsible: true,
		collapseMode: "mini",
		margin: '100 10 10 10',
		//autoScroll: true,
		lines: false,
		//region: "east",
        animate: true,
        store: storechartMetric,
		layout: 'border',
		split: true,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data1', 'data2'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: 'Values',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Metrics'
        }],
        series: [{
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            markerConfig: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }, {
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            fill: true,
            xField: 'name',
            yField: 'data2',
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]
    });
		chartPannel = Ext.create('Ext.panel.Panel', {
				        title: 'Charts',
						width: 300,
						height: 250,
						border: true,
						region: "east",
						collapsible: true,
						collapseMode: "mini",
						autoScroll: true,
						lines: false,
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						//bodyStyle:'margin:400 0 0 0',
						items: [chartPannelMetric]
						
		});
	
		Ext.create('Ext.container.Viewport', {

            layout: 'border',
            hideBorders: true,
            items: [
                
                mappanel,tree,chartPannel//chartPannel
    

            ]

        });
		
/* 		Ext.create('Ext.container.Viewport', {
    layout: 'border',
    renderTo: Ext.getBody(),
    items: [{
        region: 'north',
        html: '<h1 class="x-panel-header">Page Title</h1>',
        autoHeight: true,
        border: false,
        margins: '0 0 5 0'
    }, {
        region: 'west',
        collapsible: true,
        title: 'Navigation',
        width: 150
        // could use a TreePanel or AccordionLayout for navigational items
    }, {
        region: 'south',
        title: 'South Panel',
        collapsible: true,
        html: 'Information goes here',
        split: true,
        height: 100,
        minHeight: 100
    }, {
        region: 'east',
        title: 'East Panel',
        collapsible: true,
        split: true,
        width: 150
    }, {
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title
        activeTab: 0,      // First tab active by default
        items: {
            title: 'Default Tab',
            html: 'The first tab\'s content. Others may be added dynamically'
        }
    }]
}); */

    }

});

//http://try.sencha.com/extjs/4.1.1/docs/Ext.chart.series.Line.1/viewer.html