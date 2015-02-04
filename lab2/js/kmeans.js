    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

function calDistance(centriodPos, pointPos) {
    return Math.sqrt(Math.pow(centriodPos.A - pointPos.A, 2) + Math.pow(centriodPos.B - pointPos.B, 2) + Math.pow(centriodPos.C - pointPos.C, 2));
}
function sumOfSquaredErrorz(centriodPos, pointPos) {
    return Math.pow(centriodPos.A - pointPos.A, 2) + Math.pow(centriodPos.B - pointPos.B, 2) + Math.pow(centriodPos.C - pointPos.C, 2);
}
function calAvg(centriodVal, pointVal) {
    return Math.pow(centriodVal - pointVal, 2);
}

// 2. SET POINTS THAT BELONGS TO A CLUSTER
function setCluster(data, k, clusterArray){
    var assignedArray = [];
    var AVGCluster = [];

    for(var t = 0; t < k; t = t + 1) {
        AVGCluster[t] = {
            avgA: 0,
            avgB: 0,
            avgC: 0,
            n: 0
        };
    }

    data.forEach(function(d, i) {
        var minDist = 2, clusterId = -1;
        for(var j = 0; j < k; j = j + 1) {
            if(calDistance(d, clusterArray[j]) < minDist){
                minDist = calDistance(d, clusterArray[j]);
                clusterId = j;
            }
        }
        assignedArray.push({
            dataIndex: i,
            clusterIndex: clusterId
        });

        AVGCluster[clusterId].avgA = AVGCluster[clusterId].avgA + calAvg(clusterArray[clusterId].A, d.A);
        AVGCluster[clusterId].avgB = AVGCluster[clusterId].avgB + calAvg(clusterArray[clusterId].B, d.B);
        AVGCluster[clusterId].avgC = AVGCluster[clusterId].avgC + calAvg(clusterArray[clusterId].C, d.C);
        AVGCluster[clusterId].n = AVGCluster[clusterId].n + 1;
    })

    return [assignedArray, AVGCluster];
}


    // 3. RECALCULATE CENTROIDS POS BY CAL. AVG.
function recalCluster(clusterArray) {
    var recalCluster = [];
    clusterArray.forEach( function(a) {
        recalCluster.push({
            A: (a.avgA/a.n).toFixed(6),
            B: (a.avgB/a.n).toFixed(6),
            C: (a.avgC/a.n).toFixed(6)
        });   
    })

    return recalCluster;
}

    // 4. CAL DIFF BETWEEN CENTRIODS
function calDiff(prevCluster, updatedCluster, k) {
    var thresh = 0.1;
    for(var r = 0; r < k; r = r + 1){
        if(sumOfSquaredErrorz(prevCluster[r], updatedCluster[r]) > thresh){
            return false;
        }
    }   

    return true;
}

function kmeans(data, k) {
    

    // cluster
    var clusterArray = [];

    /*var extentA = d3.extent(data.A);
    var extentB = d3.extent(data.B);
    var extentC = d3.extent(data.C);*/
    var extentA = [0,1], extentB = [0,1], extentC = [0,1];

    // SETT K CLUSTERS
    /*k.forEach( function(d) { */
    for(var i = 0; i < k; i = i + 1) {
        clusterArray.push({ 
            A: Math.random().toFixed(6),
            B: Math.random().toFixed(6),
            C: Math.random().toFixed(6)
        });
    }

    var isGood = false;
    var clusterRes = setCluster(data, k, clusterArray);
    var clusterPoints = clusterRes[0];
    var avgDistCluster = clusterRes[1];
    // STEP 3
    var foo = clusterArray;
    var newClusters = recalCluster(avgDistCluster);
    // STEP 4
    isGood = calDiff(clusterArray, newClusters, k);

    while(!isGood) {
        // STEP 2
        clusterRes = setCluster(data, k, newClusters);
        clusterPoints = clusterRes[0];
        avgDistCluster = clusterRes[1];
        // STEP 3
        foo = newClusters;
        newClusters = recalCluster(avgDistCluster);
        // STEP 4
        isGood = calDiff(foo, newClusters, k);
        isGood = true;
    }

    return clusterPoints;

};

// VI SKA DELA UPP ALL I FUNC OCH SEDAN RETUNERA ARRY:ER OCH OM DE ÄR BRA SKICKA TILL PC.JS

    