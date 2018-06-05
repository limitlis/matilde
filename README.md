# Matilde

A small library to transform JSON input to \~FBV\~ syntax to work with Meadow endpoints.

From this:

![--](https://media.giphy.com/media/THzObbdkLXd1S/giphy.gif)

To this!!

![~~](https://media.giphy.com/media/eeDarGFPiZxyE/giphy.gif)

### Input Structure

```
[
    {...}, // See signature
    [ // nesting
        {...},
        {...},
        [ // even more nesting
            {...}
        ]
    ]
]
```

### Signature

| Argument  | Type             | Required | Description                                                                          |
|-----------|------------------|----------|--------------------------------------------------------------------------------------|
| prop      | String           | Yes      | The property to query or sort on                                                     |
| qualifier | String           | Yes      | A value from the list of qualifiers                                                  |
| value     | String           | Yes      | Value to query with                                                                  |
| op        | String           | No       | Query using `OR`. Defaults to `AND`                                                  |
| sort      | String, Boolean | No       | Sort on property `ASC` or `DESC`. Defaults to `DESC` if property is boolean and true  |

### Usage

``` JS
var inputData = [
    {
        prop: 'ID',
        qualifier: 'EQ',
        value: '1'
    },
    [
        {
            prop: 'Role',
            qualifier: 'LE',
            value: '4',
            op: 'OR'
        }, {
            prop: 'FirstName',
            qualifier: 'LK',
            value: 'Cesar',
            op: 'OR',
            sort: true
        },
        [
            {
                prop: 'LastName',
                qualifier: 'INN',
                values: ['Chavez', 'Vargas']
            }
        ]
    ]
]
// instantiate
var stuff = new Matilde();
// then manually init
stuff.init(inputData);

// or instantiate and init in one
var stuff = new Matilde(inputData);

// output
stuff.toString();

// outputs
"FBV~IDCompany~EQ~1~FOP~0~(~0~FBVOR~IDRole~EQ~4~FBVOR~FirstName~LK~one%25~FOP~0~(~0~FBL~LastName~INN~one,two~FCP~0~)~0~FCP~0~)~0~FSF~IDRole~ASC~0~FSF~FirstName~DESC~0"
```


### Methods

*.toString()*
`returns "pew-ter" string`
