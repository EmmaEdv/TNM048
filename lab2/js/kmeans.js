    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

function calDistance(dim, centroid, point) {
    var dist = 0;
    for(var i = 0; i < dim.length; i++) {
        dist += Math.pow(centroid[dim[i]] - point[dim[i]],2)
    }
    return Math.sqrt(dist);
}

// 2. SET POINTS THAT BELONGS TO A CLUSTER
function setCluster(dim, centroids, data){
    var assignedData = [];
   
    // Sätter punkter tillhörande närmsta centroid
    data.forEach( function(d, i) {
        assignedData[i] = {};
        var clusterId = -1;
        var dist = Number.MAX_VALUE;
        for(var c = 0; c < centroids.length; c++) {
            var distRes = calDistance(dim, centroids[c], d);
            if(distRes < dist) {
                dist = distRes;
                clusterId = c;
            }
        }

        if(assignedData[i]["clusterId"] == -1 || assignedData[i]["clusterId"] == null){
            for(var j = 0; j < dim.length; j++) {
                assignedData[i][dim[j]] = d[dim[j]];
            }
            
            assignedData[i]["clusterId"] = clusterId;
        }
        
    });

    return assignedData;
}


// 3. RECALCULATE CENTROIDS POS BY CAL. AVG.
function recalCluster(clusterdData, centroids, dim) {
    //En centroid i taget, vilka punkter tillhör mig? sspara dist och antal punkter
    var newCentroids = [];
    centroids.forEach(function(c, i) {
        var avgDist = {};
        for(var it = 0; it < dim.length; it++){
            avgDist[dim[it]] = 0;
        }
        var n = 0;

        clusterdData.forEach(function(d) {
        
            // ÄR ID SAMMA SOM i
            if(d.clusterId == i) {
                //Räkna avstånd för varje dim mellan centroid och punkt
                n++;
                for(var j = 0; j < dim.length; j++){
                    avgDist[dim[j]] += +d[dim[j]];
                }
            }
        })

        for(var j = 0; j < dim.length; j++){
            if(n==0) {
               // console.log(c)
                console.log("error")
            }
            else
                avgDist[dim[j]] /= n;

        }
        newCentroids[i] = avgDist;
        /*console.log("NEWCENTRIODS")
        console.log(newCentroids[i])
        console.log("END NEWCENTRIODS")*/
    })

    return newCentroids;
}

// 4. CAL DIFF BETWEEN CENTRIODS
function calDiff(oldCentroids, newCentroids, dim) {
    var thresh = 0.000001;
    for(var j = 0; j < newCentroids.length; j++){
        for(var i = 0; i < dim.length; i++){
            var diff = Math.sqrt(Math.pow(oldCentroids[j][dim[i]] - newCentroids[j][dim[i]], 2));
            if(diff > thresh){
                return false;
            }
        }
    }
    return true;
}

function kmeans(data, k) {
    var dim = Object.keys(data[0]);

    var randomCentriod = [];
    // SET RANDOM CLUSTER POINTS
    for(var i = 0; i < k; i++) {
        randomCentriod[i] = [];
        for(var d = 0; d < dim.length; d++) {
            randomCentriod[i][dim[d]] = Math.random();
        }
    }
    
    //Step 2
    var clusterdPoints = setCluster(dim, randomCentriod, data);

    //Step 3
    var updatedCentroids = recalCluster(clusterdPoints, randomCentriod, dim);

    //Step 4
    var isGood = calDiff(randomCentriod, updatedCentroids, dim);
    var howMany = 0;
    //PLÖTSLIGT FÅR ALLA KLUSTER ID: 1, VARFÖR? 
   while(!isGood){
        var previousCentroid = updatedCentroids;
        //Step 2
        clusterdPoints = setCluster(dim, previousCentroid, data);
        //Step 3
        updatedCentroids = recalCluster(clusterdPoints, previousCentroid, dim);
        //Step 4
        isGood = calDiff(previousCentroid, updatedCentroids, dim);
       // console.log(previousCentroid, updatedCentroids)
        howMany++;
        if (howMany > 10) break;
    }
console.log(howMany);
    return clusterdPoints;
};



    