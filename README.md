# MMM-volumio-playing

![Alt text](/screenshot.png "A preview of the MMM-volumio-playing module.")

A module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) that displays what
a [Volumio](https://volumio.org/) device is currently playing.

## Using the module

To use this module, clone this repo to your `MagicMirror/modules/` directory.

`git clone https://github.com/mrdis/MMM-volumio-playing.git`

And add the following configuration block to the modules array in the `config/config.js` file:
```js
        {
            module: 'MMM-volumio-playing',
            position: 'top_right',
            config: {
                url: '<Address of volumio player>'
            }
        }
```

## Configuration options

| Option               | Description
|--------------------- |-----------
| `url`                | *Required*  The address of the volumio device. <br><br>**Type:** `string`



