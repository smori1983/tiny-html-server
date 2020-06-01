# Test file pattern

|file|attribute|path type|file exists ?|has circular inclusion ?|
|---|---|---|---|---|
|`index_00_zzzz.html`|-        |-       |-|-|
|`index_01_vayy.html`|`virtual`|absolute|Y|Y|
|`index_02_vayn.html`|`virtual`|absolute|Y|n|
|`index_03_vany.html`|`virtual`|absolute|n|Y|
|`index_04_vann.html`|`virtual`|absolute|n|n|
|`index_05_vryy.html`|`virtual`|relative|Y|Y|
|`index_06_vryn.html`|`virtual`|relative|Y|n|
|`index_07_vrny.html`|`virtual`|relative|n|Y|
|`index_08_vrnn.html`|`virtual`|relative|n|n|
|`index_09_fayy.html`|`file`   |absolute|Y|Y|
|`index_10_fayn.html`|`file`   |absolute|Y|n|
|`index_11_fany.html`|`file`   |absolute|n|Y|
|`index_12_fann.html`|`file`   |absolute|n|n|
|`index_13_fryy.html`|`file`   |relative|Y|Y|
|`index_14_fryn.html`|`file`   |relative|Y|n|
|`index_15_frny.html`|`file`   |relative|n|Y|
|`index_16_frnn.html`|`file`   |relative|n|n|
