

const { createApp, ref, reactive } = Vue;
var player = null;

createApp({
    setup() {
        const message = ref('PadApp');
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
            player = new Tone.Player({
                url: pads[key],
                autostart: true,
                loop: true,
                loopStart: 10,
                loopEnd: 930,           
                fadeIn: 2,
                fadeOut: 5
            }).toDestination();
            console.info('Playing ', key);            
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