# Hyper Island: Future Roadmap (paper)

## Build script
export triangles via in chrome console:
```
exporter.faces();
exporter.vertices();
```
then build data files with:
```
node build/travel-data.js
node build/world.js
gulp build
```

## Map tool
Create local server (`python -m 'SimpleHTTPServer'`) and go to `localhost/data/isochrone`.  
![map tool](https://cloud.githubusercontent.com/assets/3438247/14259778/6179c1c2-faa0-11e5-93a8-793001639bbd.png)
