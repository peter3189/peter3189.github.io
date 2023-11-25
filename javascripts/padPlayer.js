

const { createApp, ref, reactive } = Vue;
var player = null;

createApp({
    setup() {
        var message = ref('PadApp');
        var loading = ref(false);

        var pads = reactive({
            'C': 'media/ReawakenFoundationsC.mp3',
            'G': 'media/ReawakenFoundationsG.mp3',
            'Bb': 'media/ReawakenFoundationsBb.mp3'
        });
        /*const pads = {                        
            'C': 'media/ReawakenFoundationsC.mp3',
            'G': 'media/ReawakenFoundationsG.mp3',
            'Bb': 'media/ReawakenFoundationsBb.mp3'
        };*/

        const playPad = (key) => {
            if (player) {                
                if (player.state == 'started') {
                    console.info('Stopping...');
                    player.stop();
                }
            } else {
                startAudio();
            }
            
            loading.value = true;
            message.value = `Loading ${key}...`;

            player = new Tone.Player({                
                //autostart: true,
                loop: true,
                loopStart: 10,
                loopEnd: 930,           
                fadeIn: 2,
                fadeOut: 5
            }).toDestination();
            
            player.load(pads[key]).then(() => {         
                loading.value = false;  
                message.value = `PadApp playing ${key}`;            
                player.start();         
            }).catch((error) => {                
                console.log(error);
                loading.value = false;
                message.value = `Error on loading ${key}: ${error}`;
            });       
        };

        const stopPad = () => {
            if (!player) {
                console.warn('Player is not initialized');                
            }
            console.info('Stopping pad player');
            player.stop();
        }

        const loadFile = async () => {
            try {
                let fileHandle;
                fileHandle = await window.showDirectoryPicker();
                console.log(fileHandle);
                let entries = await fileHandle.entries();
                console.log(entries);
                for await(const entry of entries) {
                    console.log(entry);
                    const file = await entry[1].getFile();
                    const url = URL.createObjectURL(file);
                    console.log(url, file);
                    pads[file.name] = url;
                }
            } catch (e) {
                console.log(e);
                alert(e);                
            }      
        }

        return {
            message,
            pads,
            playPad,
            stopPad,
            loadFile
        }
    }
}).mount('#app');

var startAudio = async () => {
    await Tone.start();
    console.log('audio is ready');
};