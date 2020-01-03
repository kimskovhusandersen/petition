# Petition

The idea behind the petition project is to create an online petition that visitors can sign to make their voice on an issue of choosing.

The backend applications uses Express.js server with Node.js and a PostgreSQL database.

As an additional feature, the app shows the location of the signers on a Google Map. For that reason, a Google Map API is necessary.

If you don't have a Google Map API, the map won't display any data, but don't worry, the rest of the application will still run.

## Installation

Clone the repository from https://github.com/kimskovhusandersen/petition.git

Run npm install

create a PostgreSQL database called "petition"

Then configure the petition database by executing the config.sql file

```
psql -d petition -f config.sql
```

create a new file named config.json and enter the following:

```
{
    "username": "YOUR_POSTGRESQL_USERNAME",
    "password": "YOUR_POSTGRESQL_PASSWORD",
    "SESSION_SECRET": "something sweet",
    "api": "YOUR_GOOGLE_MAP_API"
}

```

## Usage

Run Express.js from the directory folder:

```
node .
```

and go to http://localhost:8080

## Contributing

Kim Skovhus Andersen.

The project was developed in cooperation with SPICED Academy.

## License

Copyright (c) 2019 Kim Skovhus Andersen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
