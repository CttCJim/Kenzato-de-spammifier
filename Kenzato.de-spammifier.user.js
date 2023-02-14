// ==UserScript==
// @name         Kenzato.de-spammifier
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Remove spam from Kenzato Booru
// @author       CttCJim
// @match        https://kenzato.uk/*
// @grant        GM_notification
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kenzato.uk

// @grant        none
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
        .then (d =>
               fetch (
            `https://api.github.com/repos/${owner}/${repo}/git/blobs/${d.sha}`
        )
              )
        .then (d => d.json ())
        .then (d => JSON.parse (atob (d.content)));

        return data;
    }
    //check for updates
    const latest = await getgit('CttCJim','Kenzato-de-spammifier','Kenzato de-spammifier.user.js');
    const ver = GM_info.script.version;
    console.log(ver);
    console.log(latest);

    //your list is now combined with the community list
    const blacklist = myblacklist.concat(JSON.parse(await getgit('CttCJim','Kenzato-de-spammifier','blacklist_url.json')));
    console.log("BLACKLIST:");
    console.log(blacklist);
    for(var i=0;i<blacklist.length;i++) {
        $('a[href$="'+blacklist[i]+'"]').closest(".c8").remove(); //search by URL
        //$("a:contains('"+blacklist[i]+"')").closest(".c8").remove(); //search by name
    }
})();