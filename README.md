# barrage.js
Barrage for JavaScript.

# Usage

```html

<!-- container here -->
<div class="barrage-container"></div>

<!-- scripts -->
<script src="http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>
<script src="src/barrage.js"></script>

<script>
    $(function(){
        var config = {
            loop:true,
            barrages: [
                '<span style="color: red; font-weight: bold;">You love me or not?</span>',
                'Hello world...',
                'What are you doing here???',
                'What\'s up?',
                'You are so cute!',
                'What\'s wrong???',
                'Foo bar...',
                'Single dog!!!',
                'Go die~~ O(∩_∩)O~~'
            ],
            colors: ['red', 'blue', 'green', 'purple', 'yellow', 'grey'],
            container: '.barrage-container'
        };

        var $barrage = $('.barrage-container').barrage(config);
    });
</script>
```
### Add barrage

```javascript
$barrage.insert("Hello world!");
```

### pause

```javascript
$barrage.pause();
```
### start

```javascript
$barrage.start();
```
### destroy

```javascript
$barrage.destroy();
```

# Settings

| option | type | default | description |
| --- | ---- | ----- | --- |
| `loop` | boolean | `false` | loop play? |
| `timeRange` | object | `{min: 5000, max: 10000}` | range of random time |
| `barrages` | array | `[]` | barrages |
| `parallel` | number | `5` | parallel barrage in screen. |
| `colors` | array | `[]` | colors to random of text |
| `container` | object | `null` | the barrage display container. |
| `css` | object | `{}` | css, ex: `{fontSize: 24, ...}`

# License

MIT
