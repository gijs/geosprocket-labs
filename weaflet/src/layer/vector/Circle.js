/*
 * L.Circle is a circle overlay (with a certain radius in meters). 
 */

L.Circle = L.Path.extend({
	initialize: function(latlng, radius, options) {
		L.Path.prototype.initialize.call(this, options);
		
		this._latlng = latlng;
		this._mRadius = radius;
	},
	
	options: {
		fill: true
	},
	
	setLatLng: function(latlng) {
		this._latlng = latlng;
		this._redraw();
		return this;
	},
	
	setRadius: function(radius) {
		this._mRadius = radius;
		this._redraw();
		return this;
	},
	
	projectLatlngs: function() {
		var equatorLength = 40075017,
			scale = this._map.options.scale(this._map._zoom);
		
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._radius = (this._mRadius / equatorLength) * scale; 
	},
	
	getPathString: function() {
		var p = this._point,
			r = this._radius;
		
		if (this._checkIfEmpty()) { return ''; }
		
		if (L.Browser.svg) {
			return "M" + p.x + "," + (p.y - r) + 
					"A" + r + "," + r + ",0,1,1," + 
					(p.x - 0.1) + "," + (p.y - r) + " z";
		} else {
			p._round();
			r = Math.round(r);
			return "AL " + p.x + "," + p.y + " " + r + "," + r + " 0," + (65535 * 360);
		}
	},
	
	_checkIfEmpty: function() {
		var vp = this._map._pathViewport,
			r = this._radius,
			p = this._point;
		
		return p.x - r > vp.max.x || p.y - r > vp.max.y || 
			p.x + r < vp.min.x || p.y + r < vp.min.y;
	}
});
