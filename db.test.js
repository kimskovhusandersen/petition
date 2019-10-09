const { filterUrl, createUserProfiles } = require("./db");
// --------------------------
// filterUrl takes a url as argument and checks whether it begins with http, https or //
// test(`A url that begins with http`, () => {
//     expect(filterUrl("http://www.test.dk")).toBe("http://www.test.dk");
// });
//
// test(`A url that begins with https`, () => {
//     expect(filterUrl("https://www.test.dk")).toBe("https://www.test.dk");
// });
//
// test(`A url that begins with //`, () => {
//     expect(filterUrl("//carrots")).toBe("//carrots");
// });
//
// test(`A url that doesn't begin with http, https or //`, () => {
//     expect(filterUrl("javascript:alert(0)")).toBe(null);
// });
//
// test(`An empty url`, () => {
//     expect(filterUrl("")).toBe(null);
// });
// --------------------------

test(`Age is a number, city is a string, url begins with https, http or //, and userId is an integer`, () => {
    expect(createUserProfiles(1, "city", "//url", 1)).toEqual({});
});
