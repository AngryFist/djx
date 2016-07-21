requirejs(['common/urlQuery', 'a/b'], function(urlQuery, ab) {
        console.log(urlQuery.Init('a'));
        ab.Init(); 
        console.log($('body').length);      
});
