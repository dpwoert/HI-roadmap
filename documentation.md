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
[insert image]
