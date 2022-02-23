const details = () => ({
  id: 'Tdarr_Plugin_zeroPraxis_filter_by_chroma',
  Stage: 'Pre-processing',
  Name: 'Filter by chroma scheme',
  Type: 'Video',
  Operation: 'Filter',
  Description: 'Only allow specified chroma subsampling (4:4:4, 4:2:0, etc) scheme to be processed \n\n',
  Version: '1.00',
  Tags: 'filter',
  Inputs: [
    {
      name: 'chromasToProcess',
      type: 'string',
      defaultValue: 'yuv444p10le,yuv444p,yuvj444p,yuv444p16le,yuv444p16be,yuv444p9be,yuv444p9le,yuv444p10be,yuv444p10le,yuva444p,yuva444p9be,yuva444p9le,yuva444p10be,yuva444p16be,yuva444p16le,yuv444p12be,yuv444p12le,yuv444p14be,yuv444p14le,yuva444p12be,yuva444p12le',
      inputUI: {
        type: 'text',
      },
      tooltip:
        'Enter a comma separated list of chroma subsampling schemes to be processed. Leave blank if using chromasToNotProcess',
    },
    {
      name: 'chromasToNotProcess',
      type: 'string',
      defaultValue: '',
      inputUI: {
        type: 'text',
      },
      tooltip:
        'Enter a comma separated list of chroma subsampling schemes to be not be processed. Leave blank if using chromasToProcess',
    },
  ],
});

// eslint-disable-next-line no-unused-vars
const plugin = (file, librarySettings, inputs, otherArguments) => {
  const lib = require('../methods/lib')();
  // eslint-disable-next-line no-unused-vars,no-param-reassign
  inputs = lib.loadDefaultValues(inputs, details);
  const response = {
    processFile: false,
    infoLog: '',
  };

  var fileScheme = 'zzzzzzzz';

  videoTrack = file.ffProbeData.streams.find(track => track.codec_type == "video");
  if (videoTrack !== undefined) {
    fileScheme = videoTrack.pix_fmt;
  }

  if (inputs.chromasToProcess !== '') {
    const schemes = inputs.chromasToProcess.split(',');
    if (schemes.includes(fileScheme)) {
      response.processFile = true;
      response.infoLog += 'File is in chromasToProcess. Moving to next plugin.';
    } else {
      response.processFile = false;
      response.infoLog += 'File is not in chromasToProcess. Breaking out of plugin stack.';
    }
  }

  if (inputs.chromasToNotProcess !== '') {
    const schemes = inputs.chromasToNotProcess.split(',');
    if (schemes.includes(fileScheme)) {
      response.processFile = false;
      response.infoLog += 'File is in chromasToNotProcess. Breaking out of plugin stack.';
    } else {
      response.processFile = true;
      response.infoLog += 'File is not in chromasToNotProcess. Moving to next plugin.';
    }
  }

  return response;
};

module.exports.details = details;
module.exports.plugin = plugin;
