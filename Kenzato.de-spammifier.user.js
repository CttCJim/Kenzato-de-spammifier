// ==UserScript==
// @name         Kenzato.de-spammifier
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Remove spam from Kenzato Booru
// @author       CttCJim
// @match        https://kenzato.uk/*
// @grant        GM_notification
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kenzato.uk
// @grant        GM_notification
// ==/UserScript==

(async function() {

    // Your code here...
    'use strict';
    ///////////////////////////////////////////////////
    //manually enter users to add to the list below
    const myblacklist = [
        'morrowind4ever',
        'raider123',
        'hooly_mooly',
        'wersoreri'
    ];
    //////////////////////////////////////////////////
    async function getgit (owner, repo, path) {
        // A function to fetch files from github using the api

        let data = await fetch (
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
        )
        .then (d => d.json ())
        .then (d => fetch (`https://api.github.com/repos/${owner}/${repo}/git/blobs/${d.sha}`))
        .then (d => d.json ())
        .then (d => {
            if(isJson(atob (d.content))) {
               return JSON.parse (atob (d.content));
            } else {
               return (atob (d.content));
            }
            });

        return data;
    }
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    //check for updates
    const latest = await getgit('CttCJim','Kenzato-de-spammifier','Kenzato.de-spammifier.user.js');
    const ver = GM_info.script.version;
   // console.log(ver);
   // console.log(latest);
    var newver;
    var lines = latest.split(/\r?\n|\r|\n/g);
    for(var i=0;i<lines.length;i++) {
        if(lines[i].indexOf("@version")!=-1) {
            var theline = lines[i];
            var stpos = theline.indexOf(".")-1;
            newver = theline.substr(stpos);
        }
    }
    if(newver!=ver) {
        GM_notification({
            text: "Warning: you are using v"+ver+" of CttCJim's Kenzato de-spammifier. The latest version is "+newver+". Click here to go to the download page.",
            title: "Version Mismatch",
            image: "https://i.imgur.com/q7paNPN.png",
            onclick: () => {window.open("https://github.com/CttCJim/Kenzato-de-spammifier/releases/", '_blank').focus();}
        });
    }


    //your list is now combined with the community list
    const blacklist = myblacklist.concat(JSON.parse(await getgit('CttCJim','Kenzato-de-spammifier','blacklist_url.json')));
    for(i=0;i<blacklist.length;i++) {
        $('a[href$="'+blacklist[i]+'"]').closest(".c8").remove(); //search by URL
        //$("a:contains('"+blacklist[i]+"')").closest(".c8").remove(); //search by name
    }
})();
