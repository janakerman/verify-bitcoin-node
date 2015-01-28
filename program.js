(function() {

  var crypto, rawBlock, Block, reverseHex;

  crypto = require('crypto');

  rawBlock =  {
    hash:"000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    ver:1,
    prev_block:"0000000000000000000000000000000000000000000000000000000000000000",
    mrkl_root:"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    time:1231006505,
    bits:486604799,
    nonce:2083236893,
    n_tx:1,
    size:285,
    tx:[
      {
        hash:"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        ver:1,
        vin_sz:1,
        vout_sz:1,
        lock_time:0,
        size:204,
        in:[
          {
            prev_out:{
              hash:"0000000000000000000000000000000000000000000000000000000000000000",
              n:4294967295
            },
            coinbase:"04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73"
          }
        ],
        out:[
          {
            value:"50.00000000",
            scriptPubKey:"04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG"
          }
        ]
      }
    ],
    mrkl_tree:[
      "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"
    ]
  };


  Block = function (rawBlock) {
      this.block = rawBlock;
  };

  Block.prototype.getVersion = function () {
    return this.block.ver;
  }

  Block = function(rawBlock) {
    return {
      getVersion: function () {
        return rawBlock.ver;
      },

      getHashPrevBlock: function () {
        return rawBlock.prev_block;
      },

      getHashMerkleRoot: function () {
        return rawBlock.mrkl_root;
      },

      getTime: function () {
        return rawBlock.time;
      },

      getBits: function () {
        return rawBlock.bits;
      },

      getNonce: function () {
        return rawBlock.nonce;
      }
    };
  };

  reverseHex = function (hexString) {

    var splitByLength = function (string, splitLength) {
      var chunks = [];

      for (var i = 0, charsLength = string.length; i < charsLength; i += splitLength) {
        chunks.push(string.substring(i, i + splitLength));
      };

      return chunks;
    }

    return splitByLength(hexString, 2).reverse().join('');
  };


  var numberToHexLE = function (number) {
    var hex = number.toString(16);

    var pad = function(num, size) {
      var s = num+"";
      while (s.length < size) {
        s = "0" + s;
      };
      return s;
    }

    return reverseHex(pad(hex, 8));
  };

  var hex2Bin = function (hex) {
    var bytes = [];

    for(var i=0; i< hex.length-1; i+=2){
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return String.fromCharCode.apply(String, bytes);
  }

  var block = new Block(rawBlock);

  var headerHex = numberToHexLE(block.getVersion()) +
    reverseHex(block.getHashPrevBlock()) +
    reverseHex(block.getHashMerkleRoot()) +
    numberToHexLE(block.getTime()) +
    numberToHexLE(block.getBits()) +
    numberToHexLE(block.getNonce());


  console.log('Version: ' + numberToHexLE(block.getVersion()));
  console.log('Hash Prev Block: ' + reverseHex(block.getHashPrevBlock()));
  console.log('Merkle Root: ' + reverseHex(block.getHashMerkleRoot()));
  console.log('Time: ' + numberToHexLE(block.getTime()));
  console.log('Bits: ' + numberToHexLE(block.getBits()));
  console.log('Nonce: ' + numberToHexLE(block.getNonce()));

  console.log('Header Hex: ' + headerHex);

  var binaryHeader = hex2Bin(headerHex);

  console.log('Binary Header: ' + binaryHeader);

  var hash1 = crypto.createHash('sha256');
  hash1.update(binaryHeader, 'binary');
  var pass1 = hash1.digest('binary');

  console.log('Hash pass 1: ' + pass1);

  var hash2 = crypto.createHash('sha256');
  hash2.update(pass1, 'binary');
  var pass2 = hash2.digest('hex');

  console.log('Hash pass 2: ' + pass2);

  console.log('Final hash: 'reverseHex(pass2));

})();
