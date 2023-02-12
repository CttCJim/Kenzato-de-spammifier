// ==UserScript==
// @name         Kenzato de-spammifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove spam from Kenzato Booru
// @author       CttCJim
// @match        https://kenzato.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kenzato.uk

// @grant        none
// ==/UserScript==

(async function() {

    // Your code here...
    'use strict';
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
    /*nst blacklist = [
        'morrowind4ever',
        'raider123',
        'hooly_mooly',
        'wersoreri'
    ];*/
    const blacklist = JSON.parse(await getgit('CttCJim','Kenzato-de-spammifier','blacklist.json'));
    for(var i=0;i<blacklist.length;i++) {
        $('a[href$="'+blacklist[i]+'"]').closest(".c8").remove(); //search by URL
        //$("a:contains('"+blacklist[i]+"')").closest(".c8").remove(); //search by name
    }
})();
