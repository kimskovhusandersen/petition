const { filterUrl } = require("./db");

test(`A url that begins with http`, () => {
    expect(filterUrl("http://www.test.dk")).toBe("http://www.test.dk");
});

test(`A url that begins with https`, () => {
    expect(filterUrl("https://www.test.dk")).toBe("https://www.test.dk");
});

test(`A url that begins with //`, () => {
    expect(filterUrl("//carrots")).toBe("//carrots");
});

test(`A url that doesn't begin with http, https or //`, () => {
    expect(filterUrl("javascript:alert(0)")).toBe(null);
});

test(`An empty url`, () => {
    expect(filterUrl("")).toBe(null);
});
