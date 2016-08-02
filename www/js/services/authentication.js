vendorView.service('Services', ['$timeout', '$localStorage', '$sessionStorage',
    function($timeout, $localStorage, $sessionStorage) {
        var Obj = {};
        Obj = {
            myFunc: function() {
                console.log('Hello');
            },

                synchronize: function() {
                console.log('sync worked');
                var impressionRetrieveArray = [];
                var company = [];
                company = JSON.parse(localStorage.getItem('company'));
                console.log(company);
                impressionRetrieveArray = $localStorage.impressionUsedArray;
                console.log(impressionRetrieveArray);
                var len = company.length;
                var j = 0;
                Obj.update(j, len, company, impressionRetrieveArray);
                window.location = "#/start";
            }, //update the new impression values in database 

            update: function(j, len, company, impressionRetrieveArray) {
                if (j < len) {
                    console.log(company, impressionRetrieveArray);
                    var TabId = window.localStorage.getItem('TabId');
                    firebase.database().ref('impressionDebitted/' + company[j].companyId).orderByChild('TabId').equalTo(TabId).once('child_added', function(snapshot) {
                        console.log(j);
                        console.log(company[j].companyId);
                        var debitId = snapshot.val().impressionAssignId;
                        //console.log(impressionRetrieveArray[j]);
                        var updates = {};

                        updates['/impressionDebitted/' + company[j].companyId + '/' + debitId + '/impressionUsed'] = impressionRetrieveArray[j];
                        console.log('/impressionDebitted/' + company[j].companyId + '/' + debitId + '/impressionUsed');
                        try {
                            firebase.database().ref().update(updates);
                            console.log('Impression Used Updated');
                        } catch (e) {
                            Obj.updatePrevious(company, j, impressionRetrieveArray);
                            j++;
                            Obj.update(j, len, company, impressionRetrieveArray);
                        }
                    }).then(function() {
                        Obj.updatePrevious(company, j, impressionRetrieveArray);
                        j++;
                        Obj.update(j, len, company, impressionRetrieveArray);
                    })
                };
            }, // checks if used impression is equal to total assigned impression than move that company details to previous path of tab campaigns and change that companies impression status to completed 

            updatePrevious: function(company, j, impressionRetrieveArray) {
                if (impressionRetrieveArray[j] == company[j].impressionAssigned) {
                    console.log("hello");
                    //update impression status to completed
                    var status = 'completed';
                    var updates = {};
                    console.log(company[j].impressionAssignId);
                    updates['impressionDebitted/' + company[j].companyId + '/' + company[j].impressionAssignId + '/status'] = status;
                    firebase.database().ref().update(updates);

                    firebase.database().ref('impressionDebitted').on('child_added', function(snapshot) {
                        //searching for particular tabId 
                        snapshot.forEach(function(data) {
                            console.log(data);
                            if (data.val().status == "completed" && data.val().impressionAssignId == company[j].impressionAssignId) {
                                var debitId = data.val().impressionAssignId;
                                var companyId = data.val().companyId;
                                var TabId = data.val().TabId;
                                var newcampaignkey = firebase.database().ref('/tabCampaign/' + TabId + '/campaigns/previous').push({
                                    companyId: companyId,
                                    debitId: debitId
                                }).key;
                                firebase.database().ref('/tabCampaign/' + TabId + '/campaigns/previous/' + newcampaignkey).set({
                                    companyId: companyId,
                                    debitId: debitId
                                });
                                console.log("UpdatedPrevious");
                                //firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/current'+)
                            }
                        })
                    })
                }
            }
        };
        return Obj;
    }]
    );