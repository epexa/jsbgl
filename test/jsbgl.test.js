var browser = true;
try {
    var jsbtc = require('../src/jsbgl.js');
    var chai = require('chai');
    chai.use(require("chai-as-promised"));
    browser = false;
    var fetch = require('node-fetch');
    var window = global;
} catch (e) {
    console.log(e);
}

const assert = chai.assert;
const expect = chai.expect;
const equal = assert.equal;

describe(`${(browser) ? 'Browser' : 'Node'} test jsbtc library`, function () {
    it('Asynchronous initialization', async () => {
        await jsbtc.asyncInit(window);
    });
    describe("Hash functions:", function () {
        it('sha256', () => {
            equal(sha256("test sha256", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            equal(sha256("7465737420736861323536", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            equal(sha256("00bb", {hex: true, encoding: 'utf8'}),
                "bb88b952880c3a64d575449f8c767a53c52ce8f55f9c80f83e851aa6fce5bbea");
            equal(sha256("30306262", {hex: true}),
                "bb88b952880c3a64d575449f8c767a53c52ce8f55f9c80f83e851aa6fce5bbea");
            equal(sha256(stringToBytes("test sha256"), {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
        });
        it('double sha256', () => {
            equal(doubleSha256("test double sha256", {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256(stringToBytes("test double sha256"), {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256("7465737420646f75626c6520736861323536", {hex: true}),
                "1ab3067efb509c48bda198f48c473f034202537c28b7b4c3b2ab2c4bf4a95c8d");
            equal(doubleSha256("00bb", {encoding: "utf8", hex: true}),
                "824d078ceda8e8eb07cc8181a81f43c8855586c913dd7f54c94f05134e085d5f");
            equal(doubleSha256("30306262", {hex: true}),
                "824d078ceda8e8eb07cc8181a81f43c8855586c913dd7f54c94f05134e085d5f");
        });
       it('Class sha256', () => {
            equal(sha256("test sha256", {hex: true}),
                "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");
            let s = new SHA256().update("test sha256").hexdigest();
            equal(s, "c71d137da140c5afefd7db8e7a255df45c2ac46064e934416dc04020a91f3fd2");


        });

        it('siphash', () => {
            let v0 = new BN("0706050403020100", 16);
            let v1 = new BN("0F0E0D0C0B0A0908", 16);
            equal(siphash("000102030405060708090a0b0c0d0e0f",  {v0: v0, v1: v1}).toString('hex'), "3f2acc7f57c29bdb");
            equal(siphash("0001020304050607", {v0: v0, v1: v1}).toString('hex'), "93f5f5799a932462");
            equal(siphash("", {v0: v0, v1: v1}).toString('hex'), "726fdb47dd0e0e31");
            equal(siphash("siphash test").toString('hex'), "84c247dc01541d54");
            equal(siphash(stringToBytes("siphash test")).toString('hex'), "84c247dc01541d54");
            expect(() => siphash("", {v0: 43, v1: v1}).toString('hex')).to.throw('must be BN instance');
            expect(() => siphash("", {v0: v0, v1: 11}).toString('hex')).to.throw('must be BN instance');
        });
        it('ripemd160', () => {
            equal(ripemd160("test hash160", {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(ripemd160(stringToBytes("test hash160"), {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(ripemd160("746573742068617368313630", {hex: true}),
                "46a80bd289028559818a222eea64552d7a6a966f");
            equal(Buffer.from("46a80bd289028559818a222eea64552d7a6a966f", 'hex').equals(ripemd160("746573742068617368313630")),
                true);
            equal(Buffer.from("46a80bd289028559818a222eea64552d7a6a966f", 'hex').equals(ripemd160("146573742068617368313630")),
                false);
        });
        it('md5', () => {
            equal(md5("test hash md5", {hex: true}),
                "6715e18f329d8efc81c42a5ae0d48b7c");

        });
        it('hash160', () => {
            equal(hash160("test hash160", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(hash160("746573742068617368313630", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("746573742068617368313630")), true);
            equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("146573742068617368313630")), false);
        });

        it('sha3', () => {
            // equal(hash160("test sha3", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            // equal(hash160("746573742068617368313630", {hex: true}), "b720061a734285a70e86cb32b31f32884e198c32");
            equal(sha3(Buffer.from("0000002040dee9142842cfd14796055fc8f16e48454b31e1c1f34c69be4834f40b000000f2e8d5499863e98272006d82dab93645902a255b279b0e98add955f66b5b9b3cc7f1195e82670f1d9bc3ab00", 'hex')).hex(),
                s2rh("0000000b1ab864338f2ac7fd9d6b833be3a113031f09c30e9c944c161635e0db").hex());
            // equal(Buffer.from("b720061a734285a70e86cb32b31f32884e198c32", 'hex').equals(hash160("146573742068617368313630")), false);
        });

        it('hmac sha512', () => {
            equal(hmacSha512("super key", "super data", {hex: true}),
                "8ec43ebe20084b72849eaca74d0dff44cb8db418944a25887673dc22ef8dd52d46ca56739d3d35e841" +
                "bcebc3d7e8afc763b13c2018ef2462a5903c548c5c2600");
            equal(hmacSha512("7375706572206b6579", "super data", {hex: true}),
                "8ec43ebe20084b72849eaca74d0dff44cb8db418944a25887673dc22ef8dd52d46ca56739d3d35e841" +
                "bcebc3d7e8afc763b13c2018ef2462a5903c548c5c2600");
        });

    });


    describe("Encoder functions:", function () {
        it('encodeBase58', () => {
            equal(encodeBase58("000002030405060708090a0b0c0d0e0f"),
                "11ju1bKJX8HGdT7YmKLi");
            equal(encodeBase58("00759d5f2b6d12712fef6f0f24c56804193e1aeac176c1faae"),
                "1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1");

        });
        it('decodeBase58', () => {
            equal(decodeBase58("1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"),
                "00759d5f2b6d12712fef6f0f24c56804193e1aeac176c1faae");
            equal(encodeBase58(decodeBase58("11ju1bKJX8HGdT7YmKLi", {hex: false})),
                "11ju1bKJX8HGdT7YmKLi");
            equal(encodeBase58(decodeBase58("11ju1bKJX8HGdT7YmKLi", {hex: true})),
                "11ju1bKJX8HGdT7YmKLi");
        });

    });

    describe("BIP38 mnemonic functions:", function () {
        it('Generate entropy', () => {
            equal(generateEntropy().length, 64);
            equal(generateEntropy({strength: 224}).length, 56);
            equal(generateEntropy({strength: 192}).length, 48);
            equal(generateEntropy({strength: 160}).length, 40);
            equal(generateEntropy({strength: 128}).length, 32);
        });
        it('igam and igamc math functions', function () {
            let q = 0.0000000000001;
            equal(igam(0.56133437, 7.79533309) - 0.99989958147838275959 < q, true);
            equal(igam(3.80398274, 0.77658461) - 0.01162079725209424867 < q, true);
            equal(igam(6.71146614, 0.39790492) - 0.00000051486912406477 < q, true);
            equal(igam(5.05505886, 6.08602125) - 0.71809645160316382118 < q, true);
            equal(igam(9.45603411, 4.60043366) - 0.03112942473115925396 < q, true);
            equal(igamc(3.08284045, 0.79469709) - 0.95896191705843125686 < q, true);
            equal(igamc(7.91061495, 9.30889249) - 0.27834295370900602462 < q, true);
            equal(igamc(4.89616780, 5.75314859) - 0.30291667399717547848 < q, true);
            equal(igamc(8.11261940, 4.05857957) - 0.95010562492501993148 < q, true);
            equal(igamc(1.34835811, 6.64708856) - 0.00295250273836756942 < q, true);
        });
        it('Entropy <-> mnemonic', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let e = "ff46716c20b789aff26b59a27b74716699457f29d650815d2db1e0a0d8f81c88";
            equal(entropyToMnemonic(e), m);
            equal(mnemonicToEntropy(m), e);
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy();
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }

            e = "000000717ded6e3da64ad190e524dcdd0980099415b7a878d13fdd7583ff4da9";
            m = entropyToMnemonic(e);
            equal(mnemonicToEntropy(m), e);
            e = "000000007ded6e3da64ad190e524dcdd0980099415b7a878d13fdd7583000000";
            m = entropyToMnemonic(e);
            equal(mnemonicToEntropy(m), e);

            m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            e = '61dda75bc2c63fa6747a500ddab20358';

            equal(entropyToMnemonic(e), m);
            equal(mnemonicToEntropy(m), e);

            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 128});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 160});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 192});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
            for (let i = 0; i< 1000;i++) {
                let e = generateEntropy({strength: 224});
                let m = entropyToMnemonic(e);
                equal(mnemonicToEntropy(m), e);
            }
        }).timeout(10000);

        it('isMnemonicCheckSumValid', () => {
            let m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), true);
            m = 'gift gift gift machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), false);
            m = 'gift gift street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicCheckSumValid(m), false)
            m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                'point skate life truly hockey scout assault lab impulse boss';
            equal(isMnemonicCheckSumValid(m), true);
            m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                'point skate life forcet hockey scout assault lab impulse boss';
            equal(isMnemonicCheckSumValid(m), false);
        });

        it('isMnemonicValid', () => {
            let m = 'gift unfold street machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), true);
            m = 'gift gift gift machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), true);
            m = 'gift gift streety machine glue spring spin energy assist stereo liar ramp';
            equal(isMnemonicValid(m), false)
        });

        it('mnemonic to seed', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let s = "a870edd6272a4f0962a7595612d96645f683a3378fd9b067340eb11ebef45cb3d28fb64678cadc43969846" +
               "0a3d48bd57b2ae562b6d2b3c9fb5462d21e474191c";
            equal(mnemonicToSeed(m, {hex:true}), s);

        });


        it('splitMnemonic + combineMnemonic', () => {
            let m = entropyToMnemonic(generateEntropy());
            let s = splitMnemonic(3, 5, m);
            equal(m, combineMnemonic(s));

            for (let q = 0; q < 10; q++) {
                let t =  Math.floor(Math.random() * (10  )) + 2;
                let i =  Math.floor(Math.random() * (t - 2 )) + 2;
                let m = entropyToMnemonic(generateEntropy());
                let shares = splitMnemonic(i, t, m, {sharesVerify: true});
                let s = {};
                let q = Math.floor(Math.random() * (Object.keys(shares).length) + 1);
                if (q<i) q = i;
                let keys = [];
                for (let k in shares)
                    keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (keys.length))];

                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let m2 = combineMnemonic(s);
                equal(m, m2);
            }
        }).timeout(10000);

        it('split mnemonic with embedded indexes', () => {
            let m = 'young crime force door joy subject situate hen pen sweet brisk snake nephew sauce ' +
                   'point skate life truly hockey scout assault lab impulse boss';
            let s = "a870edd6272a4f0962a7595612d96645f683a3378fd9b067340eb11ebef45cb3d28fb64678cadc43969846" +
               "0a3d48bd57b2ae562b6d2b3c9fb5462d21e474191c";
            let t = 5;
            let i = 3;
            let shares = splitMnemonic(i, t, m, {embeddedIndex: true});
            equal(combineMnemonic(shares), m);

        });
        it('split mnemonic with embedded indexes extensive test', () => {

            let m = entropyToMnemonic(generateEntropy());
            let s = splitMnemonic(3, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));
            s = splitMnemonic(255, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));
            s = splitMnemonic(2, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));

            s = splitMnemonic(1, 255, m, {embeddedIndex: true});
            equal(m, combineMnemonic(s));

            m = "stage amused wasp estate tomorrow outer satoshi version verb pudding ghost slender";
            s = splitMnemonic(3, 8, m, {embeddedIndex: true});

            equal(m, combineMnemonic(s));

            for (let q = 0; q < 10; q++) {
                let t =  Math.floor(Math.random() * (10  )) + 2;
                let i =  Math.floor(Math.random() * (t - 2 )) + 2;
                let m = entropyToMnemonic(generateEntropy());
                // i of t shares
                let shares = splitMnemonic(i, t, m, {embeddedIndex: true, sharesVerify:true});
                let s = [];
                let keys = [];

                do {
                    let q = Math.floor(Math.random() * (shares.length));

                    if (!keys.includes(q)) {
                    s.push(shares[q]);
                    keys.push(q);
                    }

                } while (s.length < i);

                let m2 = combineMnemonic(s);
                equal(m, m2);
            }
        }).timeout(10000);
    });

    describe("BIP32 functions:", function () {
        it('createMasterXPrivateKey', () => {
            let e = "6afd4fd96ca02d0b7038429b77e8b32042fc205d031144054086130e8d83d981";
            equal("xprv9s21ZrQH143K4LAkSUTJ3JiZ4cJc1FyRxCbPoWTQVssiezx3gpav8iJdHggBTTUv37iQUrfNDYpGmTSP6zwFD2kJAFiUzpewivZUD6Jqdai",
                createMasterXPrivateKey(mnemonicToSeed(entropyToMnemonic(e))))
            equal(decodeBase58("xprv9s21ZrQH143K4LAkSUTJ3JiZ4cJc1FyRxCbPoWTQVssiezx3gpav8iJdHggBTTUv37iQUrfNDYpGmTSP6zwFD2kJAFiUzpewivZUD6Jqdai",
                {checkSum: true, hex: false}).hex(),
                createMasterXPrivateKey(mnemonicToSeed(entropyToMnemonic(e)), {base58: false}).hex())
        });

        it('xPrivateToXPublicKey', () => {
            let m = "debate pattern hotel silly grit must bronze athlete kitten salute salmon cat control hungry little";
            let seed = mnemonicToSeed(m);
            let xPriv = createMasterXPrivateKey(seed, {hex: true});
            equal("xpub661MyMwAqRbcFRtq6C9uK3bk7pmqc5ahhqDjxx6dfge6njx6jU9EhFwpLfiE6tQv8gjuez5PkQfxTZw4UUwwkut34JRYLWpJLNGPcUCGxj8",
                  xPrivateToXPublicKey(xPriv));
            xPriv = createMasterXPrivateKey(seed, {hex: false});
            equal("xpub661MyMwAqRbcFRtq6C9uK3bk7pmqc5ahhqDjxx6dfge6njx6jU9EhFwpLfiE6tQv8gjuez5PkQfxTZw4UUwwkut34JRYLWpJLNGPcUCGxj8",
                xPrivateToXPublicKey(xPriv));
            xPriv = "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47";
            equal("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2",
                xPrivateToXPublicKey(xPriv));

            equal(decodeBase58("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2",
                {checkSum: true, hex: false}).hex(),
                xPrivateToXPublicKey(xPriv, {base58: false}).hex());

            xPriv = "ttrv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47";
            expect(() => xPrivateToXPublicKey(xPriv)).to.throw('invalid');

            m = "extend whip emerge audit drama pumpkin breeze weather torch image insane rigid";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcEodnzMiUBjyAnsYRzMKSAo8e2APk4Z6qXbtWPFxtDPGLeuPRJ2NJaWQBYn6weuExWuNDsNvUWLyRXmSHBdzwZysmJoLatK7",
                xPrivateToXPublicKey(xPriv));
            m = "toast exchange giggle car seminar beyond federal debate donate confirm topple enough unusual corn photo casual section only";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcFVMC8d2uwpiGSh16zofbhi8PDzNBantpk5qNpRr1kK3mpgScnqUp4VDW9iFwt6gVgQcFp3QjfUYSNee8n9V2SZiMtotWfDm",
                xPrivateToXPublicKey(xPriv));
            m = "festival life pudding glide champion enhance sponsor phone panel permit mean guard chunk hedgehog view foam thought pride regular invite rice";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcH5iGdcfyAo1JvG6eweRhYgNvnMv7QBYZ7KNW32CKh1W3kxa2t4MHZhLt71EMhMPEifvxLmo7SKh5wmYxUDKVDeWbuHDcDsb",
                xPrivateToXPublicKey(xPriv));
            m = "window travel aunt result badge two federal defense weasel window nothing life enforce warrior rubber stool parent elevator jazz lava fame blade prefer utility";
            seed = mnemonicToSeed(m);
            xPriv = createMasterXPrivateKey(seed);
            equal("xpub661MyMwAqRbcG5AjafHzq3GsaoY2PwudLxECQ4hrkfV2K5JrnWQj1puS1Ci5DLNDTQrdU7y1ibkBFdQ2CaZnV9MHXX78gbtUXASAuQ3kiJe",
                xPrivateToXPublicKey(xPriv));
        });

        it('__deriveChildXPrivateKey', () => {
            let xPriv = "xprv9s21ZrQH143K3CSC8gBJRWPHPzi8Y17VzhuMGgSyyiGYzbbCnmUE1zpR2iQCzVGPGAQBy2m7LTEtPAvfB6p2ECoQBAWtQYgYHpn1UFQv6Mi";
            xPriv = decodeBase58(xPriv, {hex: false, checkSum: true});
            equal("xprv9uxHkb3zFYjmC9AshDxocSv8SWphDkWq7VpNauF8hhGNMuqK2o4AKhhhuFADy1H5pVVAdZJCnyDmjZBZmgUR8aciXXELWfU6tCF4BCrhz5m",
                  encodeBase58(__deriveChildXPrivateKey(xPriv, 1),{checkSum: true}));
            equal("xprv9uxHkb3zFYjm9WnMk636CLyiCt2h6mgVR2u5iy8PgAkPW1xYCuUGYUzU6A4HWS7hDhKVQufiymoj9oYjqg1h7331YjwVTfSBN97gSo65DiV",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 0),{checkSum: true}));
            equal("xprv9uxHkb3zFYzv3TK97XAQ5YykGBuFgMo5mKzjvQKuzbPf3FBeVgTC2ozTtspLBU2X4HWWFDocpB1sHjSXJby89m6cKhLhWUdhUWdF4o39kw4",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 20000),{checkSum: true}));
            equal("xprv9uxHkb3zFzs4rMGo9d25NcHCyePGswYHY6fMk76DzbZ5iCucy7VtdjYa1o4n28bnnGLW4ComhMjNiUKxbgq6p6vc9zwHfHb1fvdhAvsURty",
                encodeBase58(__deriveChildXPrivateKey(xPriv, 2000000),{checkSum: true}));

        });

        it('__deriveChildXPublicKey', () => {
            let xPub = "xpub661MyMwAqRbcFgWfEhiJneL1x2YcwTqMMvpx54rbY3oXsPvMLJnUZo8tsxpGFsUrFW9zMFKAGzaDDy1pR2uoohh1CW24Se1vkSnXRMqPV9R";
            xPub = decodeBase58(xPub, {hex: false, checkSum: true});
            equal("xpub68weA6at5vJ4Mzrpr7a6ZUvSkusBWEQLnFpgXMY1EWHNNpHgkSnX6HJwwSjN7z9PFrgTLK6gtWZ37o3b2ZAQSc4V9GdxdjVTjymSVit5Sai",
                encodeBase58(__deriveChildXPublicKey(xPub, 0),{checkSum: true}));
            equal("xpub68weA6at5vJ5fuUhS2bUgtse4cswz9VpU3UJAY93oUwpP8P4oDhTtGKizXsosJH99RWnnyD9txQXBAcyAEiykRDAoyHLCcpW2vkrnsSymDQ",
                encodeBase58(__deriveChildXPublicKey(xPub, 30),{checkSum: true}));
        });

        it('deriveXKey', () => {
            let root = "xprv9s21ZrQH143K39fFeGf2cWBTZ6NVj6ZsQ7nEK9f5pWqt4YwHPhnCF3GtMsPNA9cCz1j8j9Zs493ejkzJqUWqwGqQ2J8iNc1jFtFPbie7bZ4";
            equal(deriveXKey(root, "m/0"), "xprv9v7aNJTyjf9pZ2e1XwaKwTaiYqmwy9C43GPrczk9NauP4aWYqeKh5UfE3ocfV92UGFKBbQNZib8TDtqD8y5axYQMUzVJzHXphdNF6Cc6YM3");
            equal(deriveXKey(root, "m/0'"), "xprv9v7aNJU85KgnkrGKiEJMTnZJMSpbAvQdcUGm2q4s7Z2ZPA9iTwNdD92ESDXbxLt6WAsjaT5xHQNNgHBmwjgwscmPjE1dDuQ5rVC9Jowgu8q");
            equal(deriveXKey(root, "m/1"), "xprv9v7aNJTyjf9pazc9j5X7CkK3t4ywxLzsWazZL9x8JE1f8f7dsv6xjtWEZN2cahUYqaEkr27oyGfc7Y8KG18B55j7h57W3SdiAvXcztzB7MV");
            equal(deriveXKey(root, "m/44'/0'/0'"), "xprv9zAN5JC2upM319x3bsP9aa1jbE9MoyXNuSkm9rTggLBgUSHwsvigCrwb3VJHpkb5KLteb9jwCpXnk7kS5ac3Av8Vn5UG2PgTdrxb9wPeipW");
            equal(deriveXKey(root, "m/44'/0'/1'"), "xprv9zAN5JC2upM355bhe2xJWyzEVg7SD15PxVkN6FWPTjFPAkKoNoxPmxvC76SK6k7HDc1WQhYaXYyEUTTuVLYbKomAna5pFbDJCMVzfKHfZUS");
            let pub = "xpub6D9iUoivkBuLHZgAk4VJt7vy3hwvcToFKifxtdv124nN3YewvMGeKmEfxLVZFLTCzQLS9NBwUzFVi66w5YnHM5o3y9GwQJSfroev539tkUZ";
            equal(deriveXKey(pub, "m/0"), "xpub6FPUvcox6BxqQCt2GRHTdy5ehEKr3JRX1DjZTUutrRh8VsWNS6tfNZd5ZctuDZhm5dRdepkwBgz77p8dVmNuMbBifts556S6jy3gERc3Tfy");
            equal(deriveXKey(pub, "m/0/3/4"), "xpub6J7BeAMm9AYT56iBvZ8ceMksXimevjhcV9yCWM7UdkFZXWDvNHb7qLkFwwewtZp8bVKhsqZfHfvZN6KpT59BuQy4e93pP3AoXk8uzCu8aPJ");
            equal(deriveXKey(pub, "m/0/3/4", {base58: false}).hex(),
                decodeBase58("xpub6J7BeAMm9AYT56iBvZ8ceMksXimevjhcV9yCWM7UdkFZXWDvNHb7qLkFwwewtZp8bVKhsqZfHfvZN6KpT59BuQy4e93pP3AoXk8uzCu8aPJ",
                    {checkSum: true, hex: false}).hex());
            pub = "ppub6D9iUoivkBuLHZgAk4VJt7vy3hwvcToFKifxtdv124nN3YewvMGeKmEfxLVZFLTCzQLS9NBwUzFVi66w5YnHM5o3y9GwQJSfroev539tkUZ";
            expect(() => xPrivateToXPublicKey(deriveXKey(pub, "m/0/3/4"))).to.throw('invalid');
        });
        it('publicFromXPublicKey', () => {
           equal(publicFromXPublicKey("xpub6BP3EN8n7YTGYKL7nK9yUekCr9ixHK3taG2ATSkE5XjM7K12YMigC9pqUhj2K2f4TRg8xvDfqpHsWsjBHoMdJ6QF9dfSeKALRiTFAi9dA5T"),
               "02832b4cd1990dc9ffb7624bdc33e19061836f237f5ccd8730777a10bfca88944c");
        });
        it('privateFromXPrivateKey', () => {
            equal(privateFromXPrivateKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"),
                "L2BfXTBFwabUYoGkXKeR34f3TBpcThLtnC8yf6ZURvM952x8sWmz");
            equal(privateFromXPrivateKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"),
                "cNu63US2f9jLLwDeD9321q1S5xviXCxSyem2GkFJjcF8DTWxqteC");
            equal(privateKeyToWif(privateFromXPrivateKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47",
                {wif: false}), {testnet: true}),
                 "cNu63US2f9jLLwDeD9321q1S5xviXCxSyem2GkFJjcF8DTWxqteC");
            equal(privateKeyToWif(privateFromXPrivateKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM",
                {wif: false}), {testnet: false}),
                "L2BfXTBFwabUYoGkXKeR34f3TBpcThLtnC8yf6ZURvM952x8sWmz");
            expect(() => privateFromXPrivateKey("qprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47")).to.throw('invalid');
        });

        it('isXPrivateKeyValid', () => {
            equal(isXPrivateKeyValid("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"), true);
            equal(isXPrivateKeyValid("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"), true);
            equal(isXPrivateKeyValid("yprvAJXHiBz6oBHZouVo25rgayS7ss1FGAkAsPMrtpTX7DrAHqocTrusQmMNuA2VoJyxJ9jsfAQFRFoRrDFKAhNoVgvhLYSZ5LWqQJy7fYUzRW8"), true);
            equal(isXPrivateKeyValid("uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD"), true);
            equal(isXPrivateKeyValid("zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk"), true);
            equal(isXPrivateKeyValid("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"), true);
            equal(isXPrivateKeyValid("qprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"), false);
            equal(isXPrivateKeyValid(""), false);
            equal(isXPrivateKeyValid("1212qsdbfnn,i;p/"), false);
        });

        it('isXPublicKeyValid', () => {
            equal(isXPublicKeyValid("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X"), true);
            equal(isXPublicKeyValid("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2"), true);
            equal(isXPublicKeyValid("ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB"), true);
            equal(isXPublicKeyValid("upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL"), true);
            equal(isXPublicKeyValid("zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R"), true);
            equal(isXPublicKeyValid("vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"), true);
            equal(isXPublicKeyValid("qpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"), false);
            equal(isXPublicKeyValid(""), false);
            equal(isXPublicKeyValid("1212qsdbfnn,i;p/"), false);
        });

        it('pathXKeyTo_BIP32_XKey', () => {
            equal(pathXKeyTo_BIP32_XKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(pathXKeyTo_BIP32_XKey("ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(pathXKeyTo_BIP32_XKey("zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(pathXKeyTo_BIP32_XKey("vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");

            equal(pathXKeyTo_BIP32_XKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(pathXKeyTo_BIP32_XKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            equal(pathXKeyTo_BIP32_XKey("yprvAJXHiBz6oBHZouVo25rgayS7ss1FGAkAsPMrtpTX7DrAHqocTrusQmMNuA2VoJyxJ9jsfAQFRFoRrDFKAhNoVgvhLYSZ5LWqQJy7fYUzRW8"),
                "xprv9yh2QXKBeVk5xcJgBj54NtLchtroKYkfxGqe7RZdjDUHEjzPDCkJnhhEsx4uoQL2tWd4ugogxbSsxvdkSzxnhTF6UCk8VRhM8auUGwuyZMC");
            equal(pathXKeyTo_BIP32_XKey("uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            equal(pathXKeyTo_BIP32_XKey("zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(pathXKeyTo_BIP32_XKey("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");
            expect(() => pathXKeyTo_BIP32_XKey("qprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47")).to.throw('invalid');

            equal(encodeBase58(pathXKeyTo_BIP32_XKey("vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe",
                {base58: false}), {checkSum: true}),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");

        });

        it('pathXKeyTo_BIP32_XKey', () => {
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP44"),
                "xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP44"),
                "tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2");
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP49"),
                "ypub6TZ8XHFAAptgVqYk8TMc2rqJrqVYYJwYnyinkpsLSJviSfRfztaSx1kihDCsndWJYY6xEqmLaHFraTwDok8knAgrG1ipNwuwtdakQibcvzB");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP49"),
                "upub57Wa4MvRPNyAivfs3RdRnBNn6jhkarina5xLFiBMvCH4NVqWUPQUpKeh5KZfvYXDyYXStKeUzhrMcQt4p9upL1pW2EFdY8eMJjPA8UKuxaL");
            equal(BIP32_XKeyToPathXKey("xpub68isDcaF29MCeYMdJ6ZypmjogsM6bgx3ssCZyRyT4JYqPZcSkEQtKx6ag1FHnirP8tz9VNAn7cuJhBKf63ijyw1FPg2Po36TcuX725Mom1X", "BIP84"),
                "zpub6nPPpwv5KWSAM8jrxp9EEwvp2odzUvw3i6F1YDmDpKJbVmEuFYk1a5QriRATnYADxBDkzKMu2wcQTkYnXSYmaQNT8MRExrjSAMePoDv2d2R");
            equal(BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP84"),
                "vpub5SLqN2bLY4WeaDrysnR3zGUHGhrCXUiHVCUZ375FJCewRbejj3a3SPJq6XXFvTB9PBeFdoF3TNCuVhVdXrKq8FW6tZx483TqaTSoWx3U88j");


            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP44"),
                "xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM");
            equal(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP44"),
                "tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47");

            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP49"),
                "yprvAHDx8XGoRrSTB8SmWeQbKbtyU62upUKY89cnSTEVuCaFHcV7FUZzGRAVeenKE4VjGvvbECTQFiMgfuiUykWzWGkPTd6ZXqLDc4odjkNZA2Z");
            equal(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP49"),
                "uprv8tXDerPXZ1QsWSbPwQ6RR3S3YhsGBPzwCs2jTKmkMrk5VhWMvr6EGXLDE4oRTjX9pCMzERsgqZkd7bbgwuhCpKhVZEdDF6CUukNY3RLytkD");

            equal(BIP32_XKeyToPathXKey("xprv9xPgprbtHAtyKqFegHcy7WoUJ7tTsrL3D36Zf4LcXCCNEWfszpQReMWMdSpjE9qosHonUirqo418nd6vG46yi34nbHQ8wvWjLLjzMBFKNqM", "BIP84"),
                "zprvAc4DSBwiaXyw2RdtM1CDXgzUe4BMm6K33G91Dr8PHCx8LiJLW8jYtUpdfrjuDy9ega3Pyg3xiNiEZCL3hSw1JWRzKxnz7k9hsnsH8R1Ckwk");
            equal(encodeBase58(BIP32_XKeyToPathXKey("tprv8ZgxMBicQKsPf9QH73JoCxLYNjipEn1SHkWWfvsryrNCSbh8gBvfeTg5CrqqTpsEQZFBUxH8NuQ5EJz8EDHC261tgtvnfBNze2Jteoxhi47", "BIP84", {base58: false}), {checkSum: true}),
                "vprv9DMUxX4ShgxMMjnWmkt3d8XYig1i81zS7yYxEifdjs7xYoKbBWFntazMFGm1TeB5DqUnyuUFJE7AztDFfc7DcZP6RaKdq11yBUSBRvwZLXe");

            expect(() => BIP32_XKeyToPathXKey("tpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP384")).to.throw('unsupported');
            expect(() => BIP32_XKeyToPathXKey("kpubD6NzVbkrYhZ4YcS4zgyPcMzewmEkQ7CLs47HxSvAQ8AbH5wuJakFpxHwNyXDSmSDzNQmkKx2unk3xTDNN716cAKbgr6CyPm3hsAW4CqPVK2", "BIP84")).to.throw('invalid');

        });

    });

    describe("Shamir secret sharing functions:", function () {

        it('GF256 field math', () => {
            for (let i = 1; i < 256; i++) equal(1, __GF256_mul(i, __GF256_inverse(i)));

            for (let i = 1; i < 256; i++)
                for (let j = 1; j < 256; j++) {
                    let a = __GF256_div(i, j);
                    let b = __GF256_mul(a, j);
                    equal(i, b);
                    a = __GF256_add(i, j);
                    b = __GF256_sub(a, j);
                    equal(i, b);
                }

            let k = 2;
            for (let i = 2; i < 256; i++) {
                let a = __GF256_pow(k, i);
                let b = k;
                for (let j = 0; j < i-1; j++) b = __GF256_mul(b, k);
                equal(b, a);
            }

        });

        it('Secret splitting', () => {
            let secret = Buffer.from("w", 'utf8');
            for (let i = 0 ; i < 1000; i++) {
                let shares = __split_secret(5, 5, secret);
                let s = __restore_secret(shares);
                equal(s.toString('utf8'), secret.toString('utf8'));
            }
            secret = Buffer.from("w36575hrhgdivgsidyufgiuhgvsufgoyirsgfiusgrf", 'utf8');
            for (let i = 0 ; i < 1000; i++) {
                let shares = __split_secret(5, 5, secret);
                let s = __restore_secret(shares);
                equal(s.toString('utf8'), secret.toString('utf8'));
            }
            secret = Buffer.from("Super puper secret for splitting test", 'utf8');
            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let r = __restore_secret(shares);
                equal(r.toString('utf8'), secret.toString('utf8'));
            }

            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let s = {};
                let keys = []
                for (let k in shares) keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (Object.keys(shares).length))];
                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let r = __restore_secret(s);
                equal(r.toString('utf8'), secret.toString('utf8'));

            }

            for (let i = 2; i < 30; i++) {
                let t =  Math.floor(Math.random() * (30 - i )) + i;
                let shares = __split_secret(i, t, secret);
                let s = {};
                let keys = [];
                for (let k in shares) keys.push(k);
                do {
                    let i = keys[Math.floor(Math.random() * (Object.keys(shares).length) )];

                    s[i] = shares[i];
                } while (Object.keys(s).length < i);
                let r = __restore_secret(s);
                equal(r.toString('utf8'), secret.toString('utf8'));

            }
        }).timeout(14000);
    });

    describe("Private/Public key functions:", function () {
        it('privateKeyToWif', () => {
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4"),
                'L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: true, testnet: false}),
                'L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: false, testnet: false}),
                '5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: true, testnet: true}),
                'cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6');
            equal(privateKeyToWif("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4",
                {compressed: false, testnet: true}),
                '93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L');
            let m = Buffer.from("ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4", 'hex');
            equal(privateKeyToWif(m, {compressed: false, testnet: true}),
                '93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L');
        });

        it('createPrivateKey + wifToPrivateKey', () => {
            let wk = createPrivateKey();
            let k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k), wk);
            wk = createPrivateKey({testnet: 1});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {testnet: 1}), wk);
            wk = createPrivateKey({compressed: 0});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {compressed: 0}), wk);
            wk = createPrivateKey({compressed: 0, testnet: 1});
            k = wifToPrivateKey(wk);
            equal(privateKeyToWif(k, {compressed: 0, testnet: 1}), wk);
            wk = createPrivateKey({compressed: 0, testnet: 1, wif: 0});
            equal((wk instanceof Buffer), true);
        });

        it('isWifValid', () => {
            equal(isWifValid("L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX"), true);
            equal(isWifValid("5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), true);
            equal(isWifValid("5KPPLXhtga99qqMcWRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), false);
            equal(isWifValid("93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L"), true);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), true);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), true);
            equal(isWifValid("cUWo47X@YiyByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h6"), false);
            equal(isWifValid("cUWo47XLYiyFByuFicFS3y4FAza3r3R5XA7Bm7wA3dgSKDYox7h9"), false);
            equal(isWifValid(44), false);
        });

        it('privateToPublicKey', () => {
            let priv = "ceda1ae4286015d45ec5147fe3f63e9377ccd6d4e98bcf0847df9937da1944a4";
            let pu = "04b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(privateToPublicKey(priv), pk);
            equal(privateToPublicKey(priv, {hex: true}), pk);
            equal(privateToPublicKey(priv, {hex: false}).equals(Buffer.from(pk, 'hex')), true);
            equal(privateToPublicKey(priv, {compressed: false}), pu);
            equal(privateToPublicKey("L49obCXV7fGz2YRzLCSJgeZBYmGeBbKPT7xiehUeYX2S4URkPFZX"), pk);
            equal(privateToPublicKey("5KPPLXhtga99qqMceRo4Z6LXV3Kx6a9hRx3ez2U7EwP5KZfy2Wf"), pu);
            equal(privateToPublicKey("93A1vGXSGoDHotruGmgyRgtV8hgfFjgtmtuc4epcag886W9d44L"), pu);
            expect(() => privateToPublicKey(45)).to.throw('invalid');


        });

        it('isPublicKeyValid', () => {
            let pu = "04b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(isPublicKeyValid(pu), true);
            equal(isPublicKeyValid(pk), true);
            equal(isPublicKeyValid(Buffer.from(pu, 'hex')), true);
            equal(isPublicKeyValid(Buffer.from(pk, 'hex')), true);
            pu = "63qdbdc16dbdf4bb9cf45b55e7d03e514fb04dcef34208155c7d3ec88e9045f4c8cbe28702911260f2a1da099a338bed4ee98f66bb8dba8031a76ab537ff6663";
            pk = "02b635dbdc16dbdf455bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(isPublicKeyValid(pu), false);
            equal(isPublicKeyValid(pk), false);
            equal(isPublicKeyValid("8798"), false);
        });

        it('publicKeyAdd', () => {
            let p = "035347c6b364a977a5a41814459c2107bd64271e4923a94615855aa8d6a5b14d1f";
            let tweak = "21db3d0c73b6923e1594651bdbccea4891d5c0e0b25329a4b26a920d528bc77c";
            equal("0394b69f5ba9ca08614b3197e2bf10a44e51544cb6cf20c6125dfd0b693e91b667", publicKeyAdd(p,tweak));
            p = "04102e8f5e416cc8c6eea0e65581b9d2a2d0980a9189f9650391218f0c9c149e799717b1cf812e3a72f09b023ef62785f55a7f4f314b6f76908ab0fe4618dfa74d";
            tweak = "21db3d0c73b6923e1594651bdbccea4891d5c0e0b25329a4b26a920d528bc77c";
            equal("031de63c13ca530d77cc9ede1a8315e5358d461a86dcd0f3daa6454ec6409aa558", publicKeyAdd(p,tweak));
            equal("041de63c13ca530d77cc9ede1a8315e5358d461a86dcd0f3daa6454ec6409aa5580dd0318c7e809022de26d0f6d59f66d0b10176e243d479a34cbca5b0f2ab51cf",
                publicKeyAdd(p,tweak, {compressed: false}));
        });
    });

    describe("Address functions:", function () {
        it('hashToAddress', () => {
            let OP = OPCODE;
            let B = Buffer.from

            let pc = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
            let s = Buffer.concat([B([pc.length / 2]), B(pc, 'hex'), B([OP.OP_CHECKSIG])])
            let h = hash160(pc);
            equal(hashToAddress(h), "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
            equal(hashToAddress(h, {testnet: true}), "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            let pk = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            h = hash160(pk);
            equal(hashToAddress(h, {witnessVersion: null}), "1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1");
            equal(hashToAddress(h, {
                witnessVersion: null,
                testnet: true
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            equal(hashToAddress(h, {
                witnessVersion: null,
                testnet: true,
                scriptHash: true
            }), "2N87FX8HDDjrFTAuHSnoSo9cievn7uAM8rV");
            expect(() => hashToAddress(h.hex() + "00")).to.throw('length incorrect');
            expect(() => hashToAddress(h.hex() + "00", {witnessVersion: null})).to.throw('length incorrect');

            equal(hashToAddress(h, {
                testnet: true,
                witnessVersion: null
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            let p = "L32a8Mo1LgvjrVDbzcc3NkuUfkpoLsf2Y2oEWkV4t1KpQdFzuyff";
            pk = privateToPublicKey(p, {hex: false});
            let script = Buffer.concat([Buffer.from([0, 20]), hash160(pk)]);
            let scriptHash = hash160(script);
            equal(hashToAddress(scriptHash, {testnet: false, scriptHash: true, witnessVersion: null}),
                "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");
            expect(() => hashToAddress("test non hex input")).to.throw('encoding required');

            let test = false;
            try {
                hashToAddress("test non hex input", {testnet: false, scriptHash: true, witnessVersion: null})

            } catch (e) {
                test = true;
            }
            equal(true, test);
            equal(hashToAddress(scriptHash.hex(), {
                    testnet: false,
                    scriptHash: true,
                    witnessVersion: null
                }),
                "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");

        });

        it('addressToHash', () => {
            let h = "751e76e8199196d454941c45d1b3a323f1433bd6";
            equal(addressToHash("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", {hex: true}), h);
            equal(addressToHash("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {hex: true}), h);
            h = "1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262";
            equal(addressToHash("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3", {hex: true}), h);
            h = "a307d67484911deee457779b17505cedd20e1fe9";
            equal(addressToHash("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1", {hex: true}), h);
            equal(addressToHash("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {hex: true}), h);
            h = "14c14c8d26acbea970757b78e6429ad05a6ac6bb";
            equal(addressToHash("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw", {hex: true}), h);
            equal(addressToHash("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {hex: true}), h);

            expect(() => addressToHash(90)).to.throw('invalid');
            equal(addressToHash("QM1u8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), null);
        });

        it('publicKeyToAddress', () => {
            let cpub = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
            expect(() => publicKeyToAddress("02qqbe667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")).to.throw('encoding required');
            equal(publicKeyToAddress(cpub), "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
            equal(publicKeyToAddress(cpub, {testnet: true}), "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            equal(publicKeyToAddress(Buffer.from(cpub, 'hex'), {testnet: true}), "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx");
            cpub = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(publicKeyToAddress(cpub, {witnessVersion: null}), "1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1");
            equal(publicKeyToAddress(cpub, {
                witnessVersion: null,
                testnet: true
            }), "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            let priv = "L32a8Mo1LgvjrVDbzcc3NkuUfkpoLsf2Y2oEWkV4t1KpQdFzuyff";
            equal(publicKeyToAddress(privateToPublicKey(priv), {
                p2sh_p2wpkh: true,
                witnessVersion: null
            }), "33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw");
            expect(() => publicKeyToAddress(privateToPublicKey(priv, {compressed: false}), {p2sh_p2wpkh: true})).to.throw('length invalid');
            expect(() => publicKeyToAddress(privateToPublicKey(priv, {compressed: false}), {
                p2sh_p2wpkh: false,
                witnessVersion: 0
            })).to.throw('length invalid');
            expect(() => publicKeyToAddress(privateToPublicKey(cpub + "00", {compressed: false}))).to.throw('length invalid');
            priv = "5HrHm3Q2jUnvZPPKKDNkSSLoCqh5QyP7nvFGzHNxgw27ffPJjce";
            equal(publicKeyToAddress(privateToPublicKey(priv), {witnessVersion: null}), "1HMkFegHBraqmvvX3FP9q2Q9CymB9T9y8g");

        });

        it('addressType', () => {
            equal(addressType("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), 'P2WPKH');
            equal(addressType("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), 'P2WPKH');
            equal(addressType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), 'P2WSH');
            equal(addressType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7"), 'P2WSH');
            equal(addressType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), 'P2PKH');
            equal(addressType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c"), 'P2PKH');
            equal(addressType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), 'P2SH');
            equal(addressType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'P2SH');
            equal(addressType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'NON_STANDARD');
            let C = SCRIPT_TYPES
            equal(addressType("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", {num: true}), C['P2WPKH']);
            equal(addressType("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {num: true}), C['P2WPKH']);
            equal(addressType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3", {num: true}), C['P2WSH']);
            equal(addressType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {num: true}), C['P2WSH']);

            equal(addressType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1", {num: true}), C['P2PKH']);
            equal(addressType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {num: true}), C['P2PKH']);
            equal(addressType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw", {num: true}), C['P2SH']);
            equal(addressType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {num: true}), C['P2SH']);
            equal(addressType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {num: true}), C['NON_STANDARD']);
        });

        it('addressNetType', () => {
            equal(addressNetType("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), 'mainnet');
            equal(addressNetType("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), 'testnet');
            equal(addressNetType("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), 'mainnet');
            equal(addressNetType("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7"), 'testnet');
            equal(addressNetType("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), 'mainnet');
            equal(addressNetType("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c"), 'testnet');
            equal(addressNetType("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), 'mainnet');
            equal(addressNetType("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), 'testnet');
            equal(addressNetType("rMu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh"), null);
        });

        it('addressToScript', () => {
            equal(addressToScript("17rPqUf4Hqu6Lvpgfsavt1CzRy2GL19GD3", {'hex': true}),
                '76a9144b2832feeda5692c96c0594a6314136a998f515788ac');
            equal(addressToScript("33RYUa9jT541UNPsKdV7V1DmwMiQHpVfD3", {'hex': true}),
                'a914130319921ecbcfa33fec2a8503c4ae1c86e4419387');
            equal(addressToScript("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", {'hex': true}),
                '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(addressToScript("17rPqUf4Hqu6Lvpgfsavt1CzRy2GL19GD3").hex(),
                '76a9144b2832feeda5692c96c0594a6314136a998f515788ac');
            equal(addressToScript("33RYUa9jT541UNPsKdV7V1DmwMiQHpVfD3").hex(),
                'a914130319921ecbcfa33fec2a8503c4ae1c86e4419387');
            equal(addressToScript("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").hex(),
                '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            expect(() => addressToScript("bd6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").hex()).to.throw('address invalid');
            expect(() => addressToScript(45)).to.throw('address invalid');

        });

        it('getWitnessVersion', () => {
            equal(getWitnessVersion("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), 0);
        });

        it('isAddressValid', () => {
            equal(isAddressValid("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), true);
            equal(isAddressValid("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", {testnet: true}), true);
            equal(isAddressValid("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"), false);
            equal(isAddressValid("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), true);
            equal(isAddressValid("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {testnet: true}), true);
            equal(isAddressValid("1Fs2Xqrk4P2XADaJeZWykaGXJ4HEb6RyT1"), true);
            equal(isAddressValid("mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c", {testnet: true}), true);
            equal(isAddressValid("33am12q3Bncnn3BfvLYHczyv23Sq2Wbwjw"), true);
            equal(isAddressValid(54), false);
            equal(isAddressValid("33am12q3Bncnn3BfvLYHczyv23Sq2WWbwjw"), false);
            equal(isAddressValid("2Mu8y4mm4oF88yppDbUAAEwyBEPezrx7CLh", {testnet: true}), true);
            equal(isAddressValid("2Mu8y4mm4oF89yppDbUAAEwyBEPezrx7CLh"), false);
            equal(isAddressValid("2Mu8y4mm4oF89yppDbUAAEwyBEPezrx7CCLh"), false);
            equal(isAddressValid("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", {testnet: true}), false);
            equal(isAddressValid("tb1qw508d6qejxtdg4W5r3zarvary0c5xw7kxpjzsx", {testnet: true}), false);
            equal(isAddressValid("bc1qrp33g0q5c5txsp8arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3"), false);
            equal(isAddressValid("TB1QRP23G0Q5C5TXSP9ARYSRX4K6ZDKFS4NCE4XJ0GDCCCEFVPYSXF3Q0SL5K7", {testnet: true}), false);
            equal(isAddressValid("TB1QRP23G0Q5C5TXSP9ARYSRX4K6ZDKFS4NCE4XJ0GDCCCEFVPYSXF3Q0sL5K7", {testnet: true}), false);
            equal(isAddressValid("tb1", {testnet: true}), false);
            equal(isAddressValid("tbqqrp23g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7", {testnet: true}), false);
            equal(isAddressValid("1Fs2Xqrk4P2XADaJeZWykaGXJ2HEb6RyT1"), false);
            equal(isAddressValid("mvNyptwisQTkwL3vN8VMaVUrA3swVCX83c", {testnet: true}), false);
            equal(isAddressValid("33am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw", {testnet: true}), false);
            equal(isAddressValid("33am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw"), false);
            equal(isAddressValid("73am12q3Bncmn3BfvLYHczyv23Sq2Wbwjw"), false);
            equal(isAddressValid("2Mu8y4mm4oF78yppDbUAAEwyBEPezrx7CLh", {testnet: true}), false);
        });
    });

    describe("Script functions:", function () {
        it('hashToScript', () => {
            let h = "751e76e8199196d454941c45d1b3a323f1433bd6";
            equal(hashToScript(h, 0, {'hex': true}), '76a914751e76e8199196d454941c45d1b3a323f1433bd688ac');
            equal(hashToScript(h, 1, {'hex': true}), 'a914751e76e8199196d454941c45d1b3a323f1433bd687');
            equal(hashToScript(h, 5, {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, 6, {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, 6).toString("hex"), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            equal(hashToScript(h, "P2PKH", {'hex': true}), '76a914751e76e8199196d454941c45d1b3a323f1433bd688ac');
            equal(hashToScript(h, "P2SH", {'hex': true}), 'a914751e76e8199196d454941c45d1b3a323f1433bd687');
            equal(hashToScript(h, "P2WPKH", {'hex': true}), '0014751e76e8199196d454941c45d1b3a323f1433bd6');
            expect(() => hashToScript(h, 90)).to.throw('unsupported script type');

        });
        it('publicKeyTo_P2SH_P2WPKH_Script', () => {
            let p = "0003b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            expect(() => publicKeyTo_P2SH_P2WPKH_Script(p)).to.throw('public key len invalid');
            p = "03b635dbdc16dbdf4bb9cf5b55e7d03e514fb04dcef34208155c7d3ec88e9045f4";
            equal(publicKeyTo_P2SH_P2WPKH_Script(p, {hex: true}), "0014a307d67484911deee457779b17505cedd20e1fe9");
            equal(publicKeyTo_P2SH_P2WPKH_Script(p).hex(), "0014a307d67484911deee457779b17505cedd20e1fe9");
        });
        it('publicKeyTo_PUBKEY_Script', () => {
            let p = "0338f42586b2d10fe2ad08c170750c9317a01e59563b9e322a943b8043c7f59380";
            let s = "210338f42586b2d10fe2ad08c170750c9317a01e59563b9e322a943b8043c7f59380ac";
            equal(publicKeyTo_PUBKEY_Script(p, {hex: true}), s);
        });
        it('parseScript', () => {
            let O = OPCODE;
            let H = hexToBytes;
            let f = parseScript
            equal(f([O.OP_RETURN, 0x00]).type, "NULL_DATA");
            equal(f([O.OP_RETURN, 0x00]).data.hex(), "");
            equal(f([O.OP_RETURN].concat(H('203132333435363738393031323334353637383930313233343536373839303132'))).type,
                "NULL_DATA");
            equal(f([O.OP_RETURN].concat(H('203132333435363738393031323334353637383930313233343536373839303132'))).data.hex(),
                "3132333435363738393031323334353637383930313233343536373839303132");
            equal(f([O.OP_RETURN].concat(H('2031323334353637383930313233343536373839303132333435363738393031323131'))).type,
                "NULL_DATA_NON_STANDARD");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1, 0x00]).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1, 0x00]).data.hex(), "");
            let k = H("203132333435363738393031323334353637383930313233343536373839303132");
            let r = "3132333435363738393031323334353637383930313233343536373839303132";
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).data.hex(), r);
            k = H('2031323334353637383930313233343536373839303132333435363738393031323131');
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA_NON_STANDARD");
            k = H('503132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930');
            r = '3132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930';
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA");
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).data.hex(), r);
            k = H('51313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031');
            equal(f([O.OP_RETURN, O.OP_PUSHDATA1].concat(k)).type, "NULL_DATA_NON_STANDARD");
            let s = Buffer.from("a914546fbecb877edbe5777bc0ce4c8be6989d8edd9387", 'hex');
            equal(f(s).type, "P2SH");
            s = "a914546fbecb877edbe5777bc0ce4c8be6989d8edd9387";
            equal(f(s).nType, 1);
            equal(f(s).addressHash.hex(), '546fbecb877edbe5777bc0ce4c8be6989d8edd93');
            equal(f(s).reqSigs, null);
            s = "76a9143053ef41e2106fb5fea261c8ee3fd44f007b5ee688ac";
            equal(f(s).type, "P2PKH");
            equal(f(s).nType, 0);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '3053ef41e2106fb5fea261c8ee3fd44f007b5ee6');
            s = "410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac";
            equal(f(s).type, "PUBKEY");
            equal(f(s).nType, 2);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '119b098e2e980a229e139a9ed01a469e518e6f26');
            s = "00142ac50173769ba101bb2a2e7b32f158eb8c77d8a4";
            equal(f(s).type, "P2WPKH");
            equal(f(s).nType, 5);
            equal(f(s).reqSigs, 1);
            equal(f(s).addressHash.hex(), '2ac50173769ba101bb2a2e7b32f158eb8c77d8a4');
            s = "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d";
            equal(f(s).type, "P2WSH");
            equal(f(s).nType, 6);
            equal(f(s).reqSigs, null);
            equal(f(s).addressHash.hex(), '701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d')

            s = "512102953397b893148acec2a9da8341159e9e7fb3d32987c3563e8bdf22116213623";
            s += "441048da561da64584fb1457e906bc2840a1f963b401b632ab98761d12d74dd795bbf";
            s += "410c7b6d6fd39acf9d870cb9726578eaf8ba430bb296eac24957f3fb3395b8b042060";
            s += "466616fb675310aeb024f957b4387298dc28305bc7276bf1f7f662a6764bcdffb6a97";
            s += "40de596f89ad8000f8fa6741d65ff1338f53eb39e98179dd18c6e6be8e3953ae";
            equal(f(s).type, "MULTISIG");
            equal(f(s).nType, 4);
            equal(f(s).reqSigs, 1);

            s = "5f210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c";
            s += "715fae";
            equal(f(s).type, "MULTISIG");
            equal(f(s).nType, 4);
            equal(f(s).reqSigs, 15);
            s = "0114410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc3455410478d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71a1518063243acd4dfe96b66e3f2ec8013c8e072cd09b3834a19f81f659cc34550114ae";

            equal(f(s).type, "NON_STANDARD");
            equal(f(s).nType, 7);
            equal(f(s).reqSigs, 20);
        });
        it('scriptToAddress', () => {
            equal(scriptToAddress("76a914f18e5346e6efe17246306ce82f11ca53542fe00388ac"),
                "1P2EMAeiSJEfCrtjC6ovdWaGWW1Mb6azpX");
            equal(scriptToAddress("a9143f4eecba122ad73039d481c8d37f99cb4f887cd887"),
                "37Tm3Qz8Zw2VJrheUUhArDAoq58S6YrS3g");
            equal(scriptToAddress("76a914a307d67484911deee457779b17505cedd20e1fe988ac", {testnet: true}),
                "mvNyptwisQTmwL3vN8VMaVUrA3swVCX83c");
            equal(scriptToAddress("0014751e76e8199196d454941c45d1b3a323f1433bd6"),
                "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
            equal(scriptToAddress("0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d"),
                "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej");
        });
        it('decodeScript', () => {
            equal(decodeScript('76a9143520dd524f6ca66f63182bb23efff6cc8ee3ee6388ac'),
                "OP_DUP OP_HASH160 [20] OP_EQUALVERIFY OP_CHECKSIG");
            equal(decodeScript('76a9143520dd524f6ca66f63182bb23efff6cc8ee3ee6388ac', {asm: true}),
                "OP_DUP OP_HASH160 OP_PUSHBYTES[20] 3520dd524f6ca66f63182bb23efff6cc8ee3ee63 OP_EQUALVERIFY OP_CHECKSIG");
            equal(decodeScript('a91469f37572ab1b69f304f987b119e2450e0b71bf5c87'),
                "OP_HASH160 [20] OP_EQUAL");
            equal(decodeScript('a91469f37572ab1b69f304f987b119e2450e0b71bf5c87', {asm: true}),
                "OP_HASH160 OP_PUSHBYTES[20] 69f37572ab1b69f304f987b119e2450e0b71bf5c OP_EQUAL");

            equal(decodeScript('6a144279b52d6ee8393a9a755e8c6f633b5dd034bd67'),
                "OP_RETURN [20]");
            equal(decodeScript('6a144279b52d6ee8393a9a755e8c6f633b5dd034bd67', {asm: true}),
                "OP_RETURN OP_PUSHBYTES[20] 4279b52d6ee8393a9a755e8c6f633b5dd034bd67");
            let s = "6a4c51000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            equal(decodeScript(s,), "OP_RETURN OP_PUSHDATA1 [81]");
            equal(decodeScript(s, {asm: true}), "OP_RETURN OP_PUSHDATA1[81] 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            s = "5f210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71210378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c715fae"
            equal(decodeScript(s,), "OP_15 [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] [33] OP_15 OP_CHECKMULTISIG");
            equal(decodeScript(s, {asm: true}), 'OP_15 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_PUSHBYTES[33] 0378d430274f8c5ec1321338151e9f27f4c676a008bdf8638d07c0b6be9ab35c71 OP_15 OP_CHECKMULTISIG');
            equal(decodeScript('00144160bb1870159a08724557f75c7bb665a3a132e0',), "OP_0 [20]");
            equal(decodeScript('0020cdbf909e935c855d3e8d1b61aeb9c5e3c03ae8021b286839b1a72f2e48fdba70',), "OP_0 [32]");

        });
        it('signMessage', () => {
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).signature, s);
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).recId, 0);

        });
        it('verifySignature', () => {
            let p = "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf";
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            let msg = "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6";
            equal(verifySignature(s, privateToPublicKey(p), msg), true);

            let priv = "7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76";

            s = signMessage(msg, priv, {hex: true}).signature;
            equal(s, "304402202c843bd163b57910bff132cf84ef32c65b4ea1abefa8810accb6f1ace677078b0220338fe888b4165a187cbb7f882b6b099e63d99e25e0a6bdf2917665f9f66ea77f");
            equal(verifySignature(s, privateToPublicKey(priv), msg), true);
        });
        it('publicKeyRecovery', () => {
            let s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            equal(signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).signature, s);


            let p = "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf";
            s = "3044022047ac8e878352d3ebbde1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870540656fe9dcb";
            let msg = "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6";
            let r = signMessage("64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6",
                "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf", {hex: true}).recId;
            equal(publicKeyRecovery(s, msg, r, {hex: true}), privateToPublicKey(p, {hex: true}));
        });

        it('Delete from script', () => {
            let BF = Buffer.from, O = OPCODE;
            let s = BF([O.OP_FALSE, O.OP_1]);
            let d = BF([]);
            equal(deleteFromScript(s,d).hex(), s.hex());

            s = BF([O.OP_1, O.OP_2, O.OP_3]);
            d = BF([O.OP_2]);
            let e =  BF([O.OP_1, O.OP_3]);
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = BF([O.OP_3, O.OP_1, O.OP_3, O.OP_3, O.OP_4, O.OP_3]);
            d = BF([O.OP_3]);
            e =  BF([O.OP_1, O.OP_4]);
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = "0302ff03";
            d = "0302ff03";
            e = "";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0302ff030302ff03";
            d = "0302ff03";
            e = "";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0302ff030302ff03";
            d = "02";
            equal(deleteFromScript(s,d).hex(), s);

            s = "0302ff030302ff03";
            d = "ff";
            equal(deleteFromScript(s,d).hex(), s);

            s = "0302ff030302ff03";
            d = "03";
            e = "02ff0302ff03";
            equal(deleteFromScript(s,d).hex(), e);

            s = "02feed5169";
            d = "feed51";
            e = s;
            equal(deleteFromScript(s,d).hex(), e);

            s = "02feed5169";
            d = "02feed51";
            e = "69";
            equal(deleteFromScript(s,d).hex(), e);

            s = "516902feed5169";
            d = "feed51";
            e = s;
            equal(deleteFromScript(s,d).hex(), e);

            s = "516902feed5169";
            d = "02feed51";
            e = "516969";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0003feed";
            d = "03feed";
            e = "00";
            equal(deleteFromScript(s,d).hex(), e);

            s = "0003feed";
            d = "00";
            e = "03feed";
            equal(deleteFromScript(s,d).hex(), e);

            s = BF([O.OP_0, O.OP_0, O.OP_1, O.OP_1]);
            d = BF([O.OP_0, O.OP_1]);
            e = d;
            equal(deleteFromScript(s,d).hex(), e.hex());

            s = BF([O.OP_0, O.OP_0, O.OP_1, O.OP_0, O.OP_1, O.OP_1]);
            d = BF([O.OP_0, O.OP_1]);
            e = d;
            equal(deleteFromScript(s,d).hex(), e.hex());
        });

        it('bitcoinMessage', () => {
            let s = "ee5e7a356fdfff83d3635fe977e826d2d7964a9af94e772921e5521c06c9577c";
            equal(bitcoinMessage('test message www').hex(), s);
            s = signBitcoinMessage('test message www', "KyTZwSK5ypXcozECtm69BXHg1PnKTyCxa8qv5uvzmwdp1eVGe4Ed");
            let sig = "H5Sj3kHPdoYQywVcs7JarMP9GaIkRebE6Ioj56l5F4vESaiBUERbXzh3Bgj7fqkGALdZf1onFhNpXpbXv6KjvOM=";
            equal(s, sig);
            let w = bitcoinSignedMessageAddresses('test message www', sig);
            equal(w[0], "bc1qnr76ecc0lwadc3czch9wpdj26xc7gkzl53n0jd");
            equal(w[1], "1Ewwbq8XmfL4skiB7ERG8yX1Xc8auodZx1");
            equal(w[2], "35HqEmYKSPoJWcVSDH1szCccXWtBJ7kcBm");
            s = "H5Sj3kHPdoYQywVcs7JarMP9GaIkRebE6Ioj56l5F4vESaiBUERbXzh3Bgj7fqkGALdZf1onFhNpXpbXv6KjvOM=";
            equal(verifyBitcoinMessage('test message www', s, "bc1qnr76ecc0lwadc3czch9wpdj26xc7gkzl53n0jd"), true);
            equal(verifyBitcoinMessage('test message www', s, "1Ewwbq8XmfL4skiB7ERG8yX1Xc8auodZx1"), true);
            equal(verifyBitcoinMessage('test message www', s, "35HqEmYKSPoJWcVSDH1szCccXWtBJ7kcBm"), true);
            equal(verifyBitcoinMessage('test message www2', s, "bc1qnr76ecc0lwadc3czch9wpdj26xc7gkzl53n0jd"), false);
            s = signBitcoinMessage('test message www', "5JGpXumZnRq16qJ1RcjGbiippFScmAc1fw3nGqqKgTvBrMQk7XF");
            equal(verifyBitcoinMessage('test message www', s, "1bVp115hvcWCKf3JRMhcWFRrxZFZJ2VQA"), true);

        });
    });

    describe("Address classes:", function () {
        it('PrivateKey', () => {
            let h = "7B56E2B7BD189F4491D43A1D209E6268046DF1741F61B6397349D7AA54978E76";
            equal(new PrivateKey(h, {'compressed': true, testnet: false}).wif,
                'L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4');

            equal(new PrivateKey(h, {'compressed': false, testnet: false}).wif,
                '5Jkc7xqsrqA5pGQdwDHSQXRV3pUBLTXVjBjqJUSVz3pUmyuAFwP');
            equal(new PrivateKey('5Jkc7xqsrqA5pGQdwDHSQXRV3pUBLTXVjBjqJUSVz3pUmyuAFwP').compressed, false);
            equal(new PrivateKey(h, {'compressed': true, testnet: true}).wif,
                'cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv');

            equal(new PrivateKey(h, {'compressed': false, testnet: true}).wif,
                '92XEhhfRT4EDnKuvZZBMH7yShUptVd4h58bnP6o1KnZXYzkVa55');

            equal(new PrivateKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4",
                {'compressed': false, testnet: true}).wif,
                'L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4');
        });

        it('PublicKey', () => {
            let cpk = "02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4";
            let ucpk = "04a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb43bbd96a641808e5f34eb568e804fe679de82de419e2512736ea09013a82324a6";
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).hex, ucpk);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).key.hex(), ucpk);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).compressed, false);
            equal(new PublicKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {'compressed': false}).testnet, false);
            equal(new PublicKey(Buffer.from("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", 'hex'), {'compressed': false}).compressed, false);
            equal(new PublicKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4", {'compressed': true}).hex, cpk);
            equal(new PublicKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4", {'compressed': false}).hex, cpk);
            equal(new PublicKey(new PrivateKey("L1MU1jUjUwZ6Fd1L2HDZ8qH4oSWxct5boCQ4C87YvoSZbTW41hg4")).hex, cpk);
            equal(new PublicKey(ucpk).key.hex(), ucpk);
            equal(new PublicKey(cpk).key.hex(), cpk);
            equal(new PublicKey(ucpk, {compressed: true}).key.hex(), ucpk);

        });

        it('Address', () => {
            let p = new PrivateKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {compressed: false});
            let pub = new PublicKey(p);
            equal(new Address(p, {addressType: "P2PKH"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address("5JGpXumZnRq16qJ1RcjGbiippFScmAc1fw3nGqqKgTvBrMQk7XF").address,
                  '1bVp115hvcWCKf3JRMhcWFRrxZFZJ2VQA');

            // from public key
            p = new PublicKey('02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4');
            equal(new Address(p).address, 'bc1qxsms4rt5axt9674du2az7vq3pvephu3k5jyky8');
            equal(new Address(p, {addressType: "P2PKH"}).address, '15m65JmFohJiioQbzMWhqFeCS3ZL1KVaNh');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '15m65JmFohJiioQbzMWhqFeCS3ZL1KVaNh');
            equal(new Address(p, {addressType: "P2SH_P2WPKH"}).redeemScriptHex, '001434370a8d74e9965d7aade2ba2f30110b321bf236');
            equal(new Address(p, {addressType: "P2SH_P2WPKH"}).publicKey.hex, '02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4');

            // from uncompressed public key
            p = new PublicKey('04a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb43bbd96a641808e5f34eb568e804fe679de82de419e2512736ea09013a82324a6');
            equal(new Address(p, {addressType: "P2PKH"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');
            equal(new Address(p, {addressType: "PUBKEY"}).address, '17suVjHXyWF9KiGkpRRQW4ysiEqdDkRqo1');

            let redeem = "5221032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6921032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6921032bfc25cf7cccc278b26473e2967b8fd403b4b544b836e71abdfebb08d8c96d6953ae"
            equal(new ScriptAddress(redeem, {witnessVersion: null}).address, '3KCqqS6eznp3ucVPxtNkiYcVg6kQKNX9sg');
            let k = new Address("02a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818eeb4")
            equal(k.address, 'bc1qxsms4rt5axt9674du2az7vq3pvephu3k5jyky8');
        });


    });

    describe("Transactions classes:", function () {
        it('Transaction', () => {


            let t = "020000000140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc38700000000";
            let j = {
                "format": "decoded",
                "testnet": false,
                "segwit": false,
                "txId": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
                "hash": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
                "version": '2',
                "size": 106,
                "vSize": 106,
                "bSize": 106,
                "lockTime": '0',
                "vIn": {
                    "0": {
                        "txId": "42f7d0545ef45bd3b9cfee6b170cf6314a3bd8b3f09b610eeb436d92993ad440",
                        "vOut": 1,
                        "scriptSig": "160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955",
                        "sequence": '4294967295',
                        "scriptSigOpcodes": "[22]",
                        "scriptSigAsm": "OP_PUSHBYTES[22] 0014a4b4ca48de0b3fffc15404a1acdc8dbaae226955"
                    }
                },
                "vOut": {
                    "0": {
                        "value": '100000000',
                        "scriptPubKey": "a9144a1154d50b03292b3024370901711946cb7cccc387",
                        "nType": 1,
                        "type": "P2SH",
                        "addressHash": "4a1154d50b03292b3024370901711946cb7cccc3",
                        "reqSigs": null,
                        "address": "38Segwituno6sUoEkh57ycM6K7ej5gvJhM",
                        "scriptPubKeyOpcodes": "OP_HASH160 [20] OP_EQUAL",
                        "scriptPubKeyAsm": "OP_HASH160 OP_PUSHBYTES[20] 4a1154d50b03292b3024370901711946cb7cccc3 OP_EQUAL"
                    }
                },
                "rawTx": null,
                "blockHash": null,
                "confirmations": null,
                "time": null,
                "blockTime": null,
                "blockIndex": null,
                "coinbase": false,
                "fee": null,
                "data": null,
                "amount": '100000000',
                "weight": 424
            };
            let tx = new Transaction({rawTx: t});
            for (let q in j) {
                if (tx[q] instanceof Object) continue;
                equal(tx[q], j[q]);
            }

            for (let q in j.vIn) for (let z in j.vIn[q]) equal(tx.vIn[q][z], j.vIn[q][z]);
            for (let q in j.vOut) for (let z in j.vOut[q]) equal(tx.vOut[q][z], j.vOut[q][z]);

            t = '0200000000010140d43a99926d43eb0e619bf0b3d83b4a31f60c176beecfb9d35bf45e54d0f7420100000017160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955ffffffff0100e1f5050000000017a9144a1154d50b03292b3024370901711946cb7cccc387024830450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e0121039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e800000000'
            j = {
                "format": "decoded",
                "testnet": false,
                "segwit": true,
                "txId": "c586389e5e4b3acb9d6c8be1c19ae8ab2795397633176f5a6442a261bbdefc3a",
                "hash": "b759d39a8596b70b3a46700b83e1edb247e17ba58df305421864fe7a9ac142ea",
                "version": 2,
                "size": 216,
                "vSize": 134,
                "bSize": 106,
                "lockTime": 0,
                "vIn": {
                    "0": {
                        "txId": "42f7d0545ef45bd3b9cfee6b170cf6314a3bd8b3f09b610eeb436d92993ad440",
                        "vOut": 1,
                        "scriptSig": "160014a4b4ca48de0b3fffc15404a1acdc8dbaae226955",
                        "sequence": 4294967295,
                        "txInWitness": ["30450221008604ef8f6d8afa892dee0f31259b6ce02dd70c545cfcfed8148179971876c54a022076d771d6e91bed212783c9b06e0de600fab2d518fad6f15a2b191d7fbd262a3e01", "039d25ab79f41f75ceaf882411fd41fa670a4c672c23ffaf0e361a969cde0692e8"],
                        "scriptSigOpcodes": "[22]",
                        "scriptSigAsm": "OP_PUSHBYTES[22] 0014a4b4ca48de0b3fffc15404a1acdc8dbaae226955"
                    }
                },
                "vOut": {
                    "0": {
                        "value": '100000000',
                        "scriptPubKey": "a9144a1154d50b03292b3024370901711946cb7cccc387",
                        "nType": 1,
                        "type": "P2SH",
                        "addressHash": "4a1154d50b03292b3024370901711946cb7cccc3",
                        "reqSigs": null,
                        "address": "38Segwituno6sUoEkh57ycM6K7ej5gvJhM",
                        "scriptPubKeyOpcodes": "OP_HASH160 [20] OP_EQUAL",
                        "scriptPubKeyAsm": "OP_HASH160 OP_PUSHBYTES[20] 4a1154d50b03292b3024370901711946cb7cccc3 OP_EQUAL"
                    }
                },
                "rawTx": null,
                "blockHash": null,
                "confirmations": null,
                "time": null,
                "blockTime": null,
                "blockIndex": null,
                "coinbase": false,
                "fee": null,
                "data": null,
                "amount": '100000000',
                "flag": "01",
                "weight": 534
            };
            tx = new Transaction({rawTx: t});
            tx.encode();
            tx.decode();
            for (let q in j) {
                if (tx[q] instanceof Object) continue;
                equal(tx[q], j[q]);
            }

            for (let q in j.vIn) for (let z in j.vIn[q]) {
                if (tx.vIn[q][z] instanceof Array) {
                    for (let p in tx.vIn[q][z]) {
                        equal(tx.vIn[q][z][p], j.vIn[q][z][p])
                    }
                } else equal(tx.vIn[q][z], j.vIn[q][z]);
            }
            for (let q in j.vOut) for (let z in j.vOut[q]) equal(tx.vOut[q][z], j.vOut[q][z]);

            equal(tx.serialize(), t);


        });
        let rawBlock;

        it('Download raw block mainnet 520667 size: 1,160,482 bytes - https://bitaps.com/520667', async () => {
            let r = await fetch('https://gist.githubusercontent.com/4tochka/ec827a60214fc46eaa3aae71c6ba28bd/raw/93e875692d2a1d21cc561824461f1cda92e25bf3/test%2520block');
            let b = await r.text();
            rawBlock = Buffer.from(b, 'hex');
        }).timeout(16000);

        it('Deserialize block[520667] 2 592 transactions in raw format', () => {
            rawBlock.seek(80);
            let c =  varIntToInt(rawBlock.readVarInt());
            for (let i=0; i<c; i++) new Transaction({rawTx: rawBlock, format: 'raw'});
        });

        it('Deserialize block[520667]  2 592 transactions in decoded human readable format', () => {
            rawBlock.seek(80);
            let c =  varIntToInt(rawBlock.readVarInt());
            for (let i=0; i<c; i++) new Transaction({rawTx: rawBlock, format: 'decoded'});
        });

        it('Deserialize <-> serialize test block[520667]  2 592 transactions decoded', () => {
            rawBlock.seek(80);
            let c =  varIntToInt(rawBlock.readVarInt());
            for (let i=0; i<c; i++) {
                let t = new Transaction({rawTx: rawBlock, format: 'decoded', keepRawTx:true});
                equal(t.serialize(), t.rawTx);
            }
        });

        it('Deserialize <-> serialize test block[520667]  2 592 transactions raw', () => {
            rawBlock.seek(80);
            let c =  varIntToInt(rawBlock.readVarInt());
            for (let i=0; i<c; i++) {
                let t = new Transaction({rawTx: rawBlock, format: 'raw', keepRawTx:true});
                equal(t.serialize(), t.rawTx.hex());
            }
        });

        it('Transaction constructor', () => {
            let rt = "01000000017a5cd38b31ed002fa41380624d4a8c168a2ea71d8668a9b3fea1d571357d5d00000000006b" +
                 "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb2a612f02204db0" +
                 "7e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8cd646012102ca63094dd002a53748" +
                 "eae1319c91fd9583bb93a6441621c39085789b354569e1ffffffff02204e00000000000017a9143e6f15" +
                 "908582f42917ec31e39bf8722fc9d5db3f87763d0900000000001976a914a52dc1cff692810dfe9a918f" +
                 "6d2dbd3504fb3ffb88ac00000000";
            let tx = new Transaction({format:'raw'});
            tx.addInput({txId: "005d7d3571d5a1feb3a968861da72e8a168c4a4d628013a42f00ed318bd35c7a",
                scriptSig: "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb" +
                "2a612f02204db07e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8c" +
                "d646012102ca63094dd002a53748eae1319c91fd9583bb93a6441621c39085789b354569e1"});
            tx.addOutput({value: 20000, address: "37P8thrtDXb6Di5E7f4FL3bpzum3fhUvT7"});
            tx.addOutput({value: 605558, address: "1G4PJum2iB4giFQFpQj8RqzfbKegvWEJXV"});
            equal(tx.serialize({segwit:false, hex:true}), rt);
            equal(tx.serialize({segwit:true, hex:true}), rt);
            equal(tx.txId.equals(tx.hash), true);
            equal(rh2s(tx.txId), "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");

            tx = new Transaction();
            tx.addInput({txId: "005d7d3571d5a1feb3a968861da72e8a168c4a4d628013a42f00ed318bd35c7a",
            scriptSig: "483045022100bf7c75ec4c40d2fd1072567c31079ea96666b03f00cb8573f9d81818fb" +
                "2a612f02204db07e03825f2d8a123682b53afdd7671fa31e34e2689b591d667ec6cc8c" +
                "d646012102ca63094dd002a53748eae1319c91fd9583bb93a6441621c39085789b354569e1"})
            tx.addOutput({value: 20000, address: "37P8thrtDXb6Di5E7f4FL3bpzum3fhUvT7"});
            tx.addOutput({value: 605558, address: "1G4PJum2iB4giFQFpQj8RqzfbKegvWEJXV"});
            equal(tx.serialize({segwit:false, hex:true}), rt);
            equal(tx.serialize({segwit:true, hex:true}), rt);
            equal(tx.txId, tx.hash);
            equal(tx.txId, "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");

            tx.encode();
            equal(tx.serialize({segwit:false, hex:true}), rt);
            equal(tx.serialize({segwit:true, hex:true}), rt);
            equal(tx.txId.equals(tx.hash), true);
            equal(rh2s(tx.txId), "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");

            tx.decode();
            equal(tx.serialize({segwit:false, hex:true}), rt);
            equal(tx.serialize({segwit:true, hex:true}), rt);
            equal(tx.txId, tx.hash);
            equal(tx.txId, "110e34e7cba0d579a32c19429683dad9c3b2d4b03edec85c63a69ef0f9e6a12a");

            let rawSegwitView = "0100000000010131f81b1b36f3baf0df1c4825363a427c13fee246f5275ab19bd3d9691cab2f77010" +
                          "0000000ffffffff0428032f000000000017a91469f3772509d00c88afbdfd9a962573104c5572aa87" +
                          "20a10700000000001976a914b97d5f71eac6f1b9b893815ee2d393cee5b939fc88ac166b060000000" +
                          "00017a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf08711df090000000000220020701a8d40" +
                          "1c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d040047304402206bc09c33588" +
                          "b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b602207300db75d81f4a2de93b7c37" +
                          "faa0e32a176ca444b24509553e342f70002e44ec014830450221009947103bd40e25b8a54b95624cf" +
                          "77199ef674aab4ba53da47280f9208811cdd002207f9dbca0804be6f7c206953971af2a5e538d4b64" +
                          "0ba8041264d24bb40e8542ee016952210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea3" +
                          "68e0acdfd92976b7c2103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496" +
                          "feff2103c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae00000000";
            let rawNonSegwitView = "010000000131f81b1b36f3baf0df1c4825363a427c13fee246f5275ab19bd3d9691cab2f77010" +
                              "0000000ffffffff0428032f000000000017a91469f3772509d00c88afbdfd9a962573104c5572" +
                              "aa8720a10700000000001976a914b97d5f71eac6f1b9b893815ee2d393cee5b939fc88ac166b0" +
                              "6000000000017a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf08711df09000000000022" +
                              "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d00000000";
            tx = new Transaction();
            tx.addInput({txId: "772fab1c69d9d39bb15a27f546e2fe137c423a3625481cdff0baf3361b1bf831",
                vOut: 1, txInWitness: ["",
                    "304402206bc09c33588b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b" +
                    "602207300db75d81f4a2de93b7c37faa0e32a176ca444b24509553e342f70002e44ec01",
                    "30450221009947103bd40e25b8a54b95624cf77199ef674aab4ba53da47280f9208811c" +
                    "dd002207f9dbca0804be6f7c206953971af2a5e538d4b640ba8041264d24bb40e8542ee01",
                    "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2" +
                    "103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103" +
                    "c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae"]});
            tx.addOutput({value: 3081000, address: "3BMEXxajhZYe3xijDp4R9axzJ6Avywupwk"});
            tx.addOutput({value: 500000, address: "1HunCYemQiLVPMbqY1QdarDKPiVq2Y86aR"});
            tx.addOutput({value: 420630, address: "3DU6k6uJBaeSJqkjTYLHixKycrfAZQQ5pP"});
            tx.addOutput({value: 646929, address: "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej"});

            equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
            equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
            equal(tx.txId, "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
            equal(tx.hash, "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
            equal(tx.vOut[3].address, "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej");
            // from raw
            tx = new Transaction({format: 'raw'});
            tx.addInput({txId: "772fab1c69d9d39bb15a27f546e2fe137c423a3625481cdff0baf3361b1bf831",
                vOut: 1, txInWitness: ["",
                    "304402206bc09c33588b92f245e18d70538c0eb350bfe3861cec518be85e4268eb1740b" +
                    "602207300db75d81f4a2de93b7c37faa0e32a176ca444b24509553e342f70002e44ec01",
                    "30450221009947103bd40e25b8a54b95624cf77199ef674aab4ba53da47280f9208811c" +
                    "dd002207f9dbca0804be6f7c206953971af2a5e538d4b640ba8041264d24bb40e8542ee01",
                    "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2" +
                    "103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103" +
                    "c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae"]});
            tx.addOutput({value: 3081000, address: "3BMEXxajhZYe3xijDp4R9axzJ6Avywupwk"});
            tx.addOutput({value: 500000, address: "1HunCYemQiLVPMbqY1QdarDKPiVq2Y86aR"});
            tx.addOutput({value: 420630, address: "3DU6k6uJBaeSJqkjTYLHixKycrfAZQQ5pP"});
            tx.addOutput({value: 646929, address: "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej"});

            equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
            equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
            equal(rh2s(tx.txId), "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
            equal(rh2s(tx.hash), "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
            equal(tx.decode().vOut[3].address, "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej");
            tx.encode();
            // remove 2 last outs and add using script
            tx.delOutput().delOutput();
            tx.addOutput({value: 420630, scriptPubKey: "a9148130201b6b9b07e34bae2f1a03ab470b1f6bddf087"});
            tx.addOutput({value: 646929, scriptPubKey: "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d"});
            equal(tx.serialize({segwit:false, hex:true}), rawNonSegwitView);
            equal(tx.serialize({segwit:true, hex:true}), rawSegwitView);
            equal(rh2s(tx.txId), "4e3895de573305e08b09926f410836ae30e9e3e909b92beea6a4dd7eb096609e");
            equal(rh2s(tx.hash), "56a3ad9e259676b347d7a90d4cf65a3a60c29e0b49dbad0831846bcaad7d5db2");
            equal(tx.decode().vOut[3].address, "bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej");
            // segwit inside p2sh 883f786b3a823b143227e67e47001c11eadf0264ee9149bd5283a6f87a3dcdea
            tx = new Transaction();
            tx.addInput({txId: "376c1ed1c7d3108d17f80f3daa6c4e8eda5c83c7420d5ebf220bec723f17eccd",
                scriptSig: "160014bed11faa92d17d45905c41ba984d1a9107cead5f",
                txInWitness: ["3045022100ec7467e47c94a2c33b13cee8a07a5893a9e312fd3cb59a3633315468c171c7" +
                    "550220014f1be125744137ebb93c120c0e51c6a190e8fd148bf637345412343efbb3fd01",
                    "023170589b32f242682d1f69f67c9838be0afb557cbb9c42516780e60cdce5d005"]})
            tx.addOutput({value: 16760, address: "1BviYPm6tjmAU3JzK7JgW4GcG1NPDwpcJA"});
            equal(tx.txId, "883f786b3a823b143227e67e47001c11eadf0264ee9149bd5283a6f87a3dcdea");
            equal(tx.hash, "5052d63f0e94dfb811287ae7f1bce9689773fdb236a48d2a266aa9016190015a");
            equal(tx.size, 218);
            equal(tx.vSize, 136);
            equal(tx.weight, 542);
            equal(tx.bSize, 108);
            // coinbase transaction e94469dd87ac25ad9c4fe46f9bf51dbd587be0655bca87499d6faf35c432af46
            tx = new Transaction();
            tx.addInput({scriptSig: "03f5a407172f5669614254432f4d696e6564206279206a6e3734312f2cfabe6d6d978decb415" +
                "6738d7e170b52ba6d79129afb443cd1444215621f1b2fa0912389c01000000000000001095bc" +
                "4e04f95c206d2f9a5abc64050060",
                txInWitness: ["0000000000000000000000000000000000000000000000000000000000000000"]});
            tx.addOutput({value: 2018213798, address: "18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX"});
            tx.addOutput({value:0, scriptPubKey: "6a24aa21a9edc00d472fceafe0fc49747df90d75f7324e3c83214b1a1308f3eda376848df481"});
            equal(tx.hash, "906221165b1c5f236a787ba5dbd8c9d590c52d30a39ee557a504c5c64e70e920");
            equal(tx.txId, "e94469dd87ac25ad9c4fe46f9bf51dbd587be0655bca87499d6faf35c432af46");
            equal(tx.size, 258);
            equal(tx.vSize, 231);
            equal(tx.weight, 924);
            equal(tx.bSize, 222);
        });




        it('sigHash', () => {
            let t = [
                ["907c2bc503ade11cc3b04eb2918b6f547b0630ab569273824748c87ea14b0696526c66ba740200000004ab65ababfd1f9bdd4ef073c7afc4ae00da8a66f429c917a0081ad1e1dabce28d373eab81d8628de802000000096aab5253ab52000052ad042b5f25efb33beec9f3364e8a9139e8439d9d7e26529c3c30b6c3fd89f8684cfd68ea0200000009ab53526500636a52ab599ac2fe02a526ed040000000008535300516352515164370e010000000003006300ab2ec229", "", 2, 1864164639, "31af167a6cf3f9d5f6875caa4d31704ceb0eba078d132b78dab52c3b8997317e"],
                ["a0aa3126041621a6dea5b800141aa696daf28408959dfb2df96095db9fa425ad3f427f2f6103000000015360290e9c6063fa26912c2e7fb6a0ad80f1c5fea1771d42f12976092e7a85a4229fdb6e890000000001abc109f6e47688ac0e4682988785744602b8c87228fcef0695085edf19088af1a9db126e93000000000665516aac536affffffff8fe53e0806e12dfd05d67ac68f4768fdbe23fc48ace22a5aa8ba04c96d58e2750300000009ac51abac63ab5153650524aa680455ce7b000000000000499e50030000000008636a00ac526563ac5051ee030000000003abacabd2b6fe000000000003516563910fb6b5", "65", 0, -1391424484, "48d6a1bd2cd9eec54eb866fc71209418a950402b5d7e52363bfb75c98e141175"],
                ["6e7e9d4b04ce17afa1e8546b627bb8d89a6a7fefd9d892ec8a192d79c2ceafc01694a6a7e7030000000953ac6a51006353636a33bced1544f797f08ceed02f108da22cd24c9e7809a446c61eb3895914508ac91f07053a01000000055163ab516affffffff11dc54eee8f9e4ff0bcf6b1a1a35b1cd10d63389571375501af7444073bcec3c02000000046aab53514a821f0ce3956e235f71e4c69d91abe1e93fb703bd33039ac567249ed339bf0ba0883ef300000000090063ab65000065ac654bec3cc504bcf499020000000005ab6a52abac64eb060100000000076a6a5351650053bbbc130100000000056a6aab53abd6e1380100000000026a51c4e509b8", "acab655151", 0, 479279909, "2a3d95b09237b72034b23f2d2bb29fa32a58ab5c6aa72f6aafdfa178ab1dd01c"],
                ["73107cbd025c22ebc8c3e0a47b2a760739216a528de8d4dab5d45cbeb3051cebae73b01ca10200000007ab6353656a636affffffffe26816dffc670841e6a6c8c61c586da401df1261a330a6c6b3dd9f9a0789bc9e000000000800ac6552ac6aac51ffffffff0174a8f0010000000004ac52515100000000", "5163ac63635151ac", 1, 1190874345, "06e328de263a87b09beabe222a21627a6ea5c7f560030da31610c4611f4a46bc"],
                ["e93bbf6902be872933cb987fc26ba0f914fcfc2f6ce555258554dd9939d12032a8536c8802030000000453ac5353eabb6451e074e6fef9de211347d6a45900ea5aaf2636ef7967f565dce66fa451805c5cd10000000003525253ffffffff047dc3e6020000000007516565ac656aabec9eea010000000001633e46e600000000000015080a030000000001ab00000000", "5300ac6a53ab6a", 1, -886562767, "f03aa4fc5f97e826323d0daa03343ebf8a34ed67a1ce18631f8b88e5c992e798"],
                ["50818f4c01b464538b1e7e7f5ae4ed96ad23c68c830e78da9a845bc19b5c3b0b20bb82e5e9030000000763526a63655352ffffffff023b3f9c040000000008630051516a6a5163a83caf01000000000553ab65510000000000", "6aac", 0, 946795545, "746306f322de2b4b58ffe7faae83f6a72433c22f88062cdde881d4dd8a5a4e2d"],
                ["a93e93440250f97012d466a6cc24839f572def241c814fe6ae94442cf58ea33eb0fdd9bcc1030000000600636a0065acffffffff5dee3a6e7e5ad6310dea3e5b3ddda1a56bf8de7d3b75889fc024b5e233ec10f80300000007ac53635253ab53ffffffff0160468b04000000000800526a5300ac526a00000000", "ac00636a53", 1, 1773442520, "5c9d3a2ce9365bb72cfabbaa4579c843bb8abf200944612cf8ae4b56a908bcbd"],
                ["ce7d371f0476dda8b811d4bf3b64d5f86204725deeaa3937861869d5b2766ea7d17c57e40b0100000003535265ffffffff7e7e9188f76c34a46d0bbe856bde5cb32f089a07a70ea96e15e92abb37e479a10100000006ab6552ab655225bcab06d1c2896709f364b1e372814d842c9c671356a1aa5ca4e060462c65ae55acc02d0000000006abac0063ac5281b33e332f96beebdbc6a379ebe6aea36af115c067461eb99d22ba1afbf59462b59ae0bd0200000004ab635365be15c23801724a1704000000000965006a65ac00000052ca555572", "53ab530051ab", 1, 2030598449, "c336b2f7d3702fbbdeffc014d106c69e3413c7c71e436ba7562d8a7a2871f181"],
                ["d3b7421e011f4de0f1cea9ba7458bf3486bee722519efab711a963fa8c100970cf7488b7bb0200000003525352dcd61b300148be5d05000000000000000000", "535251536aac536a", 0, -1960128125, "29aa6d2d752d3310eba20442770ad345b7f6a35f96161ede5f07b33e92053e2a"],
                ["04bac8c5033460235919a9c63c42b2db884c7c8f2ed8fcd69ff683a0a2cccd9796346a04050200000003655351fcad3a2c5a7cbadeb4ec7acc9836c3f5c3e776e5c566220f7f965cf194f8ef98efb5e3530200000007526a006552526526a2f55ba5f69699ece76692552b399ba908301907c5763d28a15b08581b23179cb01eac03000000075363ab6a516351073942c2025aa98a05000000000765006aabac65abd7ffa6030000000004516a655200000000", "53ac6365ac526a", 1, 764174870, "bf5fdc314ded2372a0ad078568d76c5064bf2affbde0764c335009e56634481b"],
                ["c363a70c01ab174230bbe4afe0c3efa2d7f2feaf179431359adedccf30d1f69efe0c86ed390200000002ab51558648fe0231318b04000000000151662170000000000008ac5300006a63acac00000000", "", 0, 2146479410, "191ab180b0d753763671717d051f138d4866b7cb0d1d4811472e64de595d2c70"],
                ["8d437a7304d8772210a923fd81187c425fc28c17a5052571501db05c7e89b11448b36618cd02000000026a6340fec14ad2c9298fde1477f1e8325e5747b61b7e2ff2a549f3d132689560ab6c45dd43c3010000000963ac00ac000051516a447ed907a7efffebeb103988bf5f947fc688aab2c6a7914f48238cf92c337fad4a79348102000000085352ac526a5152517436edf2d80e3ef06725227c970a816b25d0b58d2cd3c187a7af2cea66d6b27ba69bf33a0300000007000063ab526553f3f0d6140386815d030000000003ab6300de138f00000000000900525153515265abac1f87040300000000036aac6500000000", "51", 3, -315779667, "b6632ac53578a741ae8c36d8b69e79f39b89913a2c781cdf1bf47a8c29d997a5"],
                ["fd878840031e82fdbe1ad1d745d1185622b0060ac56638290ec4f66b1beef4450817114a2c0000000009516a63ab53650051abffffffff37b7a10322b5418bfd64fb09cd8a27ddf57731aeb1f1f920ffde7cb2dfb6cdb70300000008536a5365ac53515369ecc034f1594690dbe189094dc816d6d57ea75917de764cbf8eccce4632cbabe7e116cd0100000003515352ffffffff035777fc000000000003515200abe9140300000000050063005165bed6d10200000000076300536363ab65195e9110", "635265", 0, 1729787658, "6e3735d37a4b28c45919543aabcb732e7a3e1874db5315abb7cc6b143d62ff10"],
                ["f40a750702af06efff3ea68e5d56e42bc41cdb8b6065c98f1221fe04a325a898cb61f3d7ee030000000363acacffffffffb5788174aef79788716f96af779d7959147a0c2e0e5bfb6c2dba2df5b4b97894030000000965510065535163ac6affffffff0445e6fd0200000000096aac536365526a526aa6546b000000000008acab656a6552535141a0fd010000000000c897ea030000000008526500ab526a6a631b39dba3", "00abab5163ac", 1, -1778064747, "d76d0fc0abfa72d646df888bce08db957e627f72962647016eeae5a8412354cf"],
                ["a63bc673049c75211aa2c09ecc38e360eaa571435fedd2af1116b5c1fa3d0629c269ecccbf0000000008ac65ab516352ac52ffffffffbf1a76fdda7f451a5f0baff0f9ccd0fe9136444c094bb8c544b1af0fa2774b06010000000463535253ffffffff13d6b7c3ddceef255d680d87181e100864eeb11a5bb6a3528cb0d70d7ee2bbbc02000000056a0052abab951241809623313b198bb520645c15ec96bfcc74a2b0f3db7ad61d455cc32db04afc5cc702000000016309c9ae25014d9473020000000004abab6aac3bb1e803", "", 3, -232881718, "6e48f3da3a4ac07eb4043a232df9f84e110485d7c7669dd114f679c27d15b97e"],
                ["4c565efe04e7d32bac03ae358d63140c1cfe95de15e30c5b84f31bb0b65bb542d637f49e0f010000000551abab536348ae32b31c7d3132030a510a1b1aacf7b7c3f19ce8dc49944ef93e5fa5fe2d356b4a73a00100000009abac635163ac00ab514c8bc57b6b844e04555c0a4f4fb426df139475cd2396ae418bc7015820e852f711519bc202000000086a00510000abac52488ff4aec72cbcfcc98759c58e20a8d2d9725aa4a80f83964e69bc4e793a4ff25cd75dc701000000086a52ac6aac5351532ec6b10802463e0200000000000553005265523e08680100000000002f39a6b0", "", 3, 70712784, "c6076b6a45e6fcfba14d3df47a34f6aadbacfba107e95621d8d7c9c0e40518ed"],
                ["1233d5e703403b3b8b4dae84510ddfc126b4838dcb47d3b23df815c0b3a07b55bf3098110e010000000163c5c55528041f480f40cf68a8762d6ed3efe2bd402795d5233e5d94bf5ddee71665144898030000000965525165655151656affffffff6381667e78bb74d0880625993bec0ea3bd41396f2bcccc3cc097b240e5e92d6a01000000096363acac6a63536365ffffffff04610ad60200000000065251ab65ab52e90d680200000000046351516ae30e98010000000008abab52520063656a671856010000000004ac6aac514c84e383", "6aabab636300", 1, -114996813, "aeb8c5a62e8a0b572c28f2029db32854c0b614dbecef0eaa726abebb42eebb8d"],
                ["0c69702103b25ceaed43122cc2672de84a3b9aa49872f2a5bb458e19a52f8cc75973abb9f102000000055365656aacffffffff3ffb1cf0f76d9e3397de0942038c856b0ebbea355dc9d8f2b06036e19044b0450100000000ffffffff4b7793f4169617c54b734f2cd905ed65f1ce3d396ecd15b6c426a677186ca0620200000008655263526551006a181a25b703240cce0100000000046352ab53dee22903000000000865526a6a516a51005e121602000000000852ab52ababac655200000000", "6a516aab63", 1, -2040012771, "a6e6cb69f409ec14e10dd476f39167c29e586e99bfac93a37ed2c230fcc1dbbe"],
                ["fd22692802db8ae6ab095aeae3867305a954278f7c076c542f0344b2591789e7e33e4d29f4020000000151ffffffffb9409129cfed9d3226f3b6bab7a2c83f99f48d039100eeb5796f00903b0e5e5e0100000006656552ac63abd226abac0403e649000000000007abab51ac5100ac8035f10000000000095165006a63526a52510d42db030000000007635365ac6a63ab24ef5901000000000453ab6a0000000000", "536a52516aac6a", 1, 309309168, "7ca0f75e6530ec9f80d031fc3513ca4ecd67f20cb38b4dacc6a1d825c3cdbfdb"],
                ["a43f85f701ffa54a3cc57177510f3ea28ecb6db0d4431fc79171cad708a6054f6e5b4f89170000000008ac6a006a536551652bebeaa2013e779c05000000000665ac5363635100000000", "ac", 0, 2028978692, "58294f0d7f2e68fe1fd30c01764fe1619bcc7961d68968944a0e263af6550437"],
                ["c2b0b99001acfecf7da736de0ffaef8134a9676811602a6299ba5a2563a23bb09e8cbedf9300000000026300ffffffff042997c50300000000045252536a272437030000000007655353ab6363ac663752030000000002ab6a6d5c900000000000066a6a5265abab00000000", "52ac525163515251", 0, -894181723, "8b300032a1915a4ac05cea2f7d44c26f2a08d109a71602636f15866563eaafdc"],
                ["82f9f10304c17a9d954cf3380db817814a8c738d2c811f0412284b2c791ec75515f38c4f8c020000000265ab5729ca7db1b79abee66c8a757221f29280d0681355cb522149525f36da760548dbd7080a0100000001510b477bd9ce9ad5bb81c0306273a3a7d051e053f04ecf3a1dbeda543e20601a5755c0cfae030000000451ac656affffffff71141a04134f6c292c2e0d415e6705dfd8dcee892b0d0807828d5aeb7d11f5ef0300000001520b6c6dc802a6f3dd0000000000056aab515163bfb6800300000000015300000000", "", 3, -635779440, "d55ed1e6c53510f2608716c12132a11fb5e662ec67421a513c074537eeccc34b"],
                ["8edcf5a1014b604e53f0d12fe143cf4284f86dc79a634a9f17d7e9f8725f7beb95e8ffcd2403000000046aabac52ffffffff01c402b5040000000005ab6a63525100000000", "6351525251acabab6a", 0, 1520147826, "2765bbdcd3ebb8b1a316c04656b28d637f80bffbe9b040661481d3dc83eea6d6"],
                ["2074bad5011847f14df5ea7b4afd80cd56b02b99634893c6e3d5aaad41ca7c8ee8e5098df003000000026a6affffffff018ad59700000000000900ac656a526551635300000000", "65635265", 0, -1804671183, "663c999a52288c9999bff36c9da2f8b78d5c61b8347538f76c164ccba9868d0a"],
                ["7100b11302e554d4ef249ee416e7510a485e43b2ba4b8812d8fe5529fe33ea75f36d392c4403000000020000ffffffff3d01a37e075e9a7715a657ae1bdf1e44b46e236ad16fd2f4c74eb9bf370368810000000007636553ac536365ffffffff01db696a0400000000065200ac656aac00000000", "63005151", 0, -1210499507, "b9c3aee8515a4a3b439de1ffc9c156824bda12cb75bfe5bc863164e8fd31bd7a"],
                ["02c1017802091d1cb08fec512db7b012fe4220d57a5f15f9e7676358b012786e1209bcff950100000004acab6352ffffffff799bc282724a970a6fea1828984d0aeb0f16b67776fa213cbdc4838a2f1961a3010000000951516a536552ab6aabffffffff016c7b4b03000000000865abac5253ac5352b70195ad", "65655200516a", 0, -241626954, "be567cb47170b34ff81c66c1142cb9d27f9b6898a384d6dfc4fce16b75b6cb14"],
                ["cb3178520136cd294568b83bb2520f78fecc507898f4a2db2674560d72fd69b9858f75b3b502000000066aac00515100ffffffff03ab005a01000000000563526363006e3836030000000001abfbda3200000000000665ab0065006500000000", "ab516a0063006a5300", 0, 1182109299, "2149e79c3f4513da4e4378608e497dcfdfc7f27c21a826868f728abd2b8a637a"],
                ["18a4b0c004702cf0e39686ac98aab78ad788308f1d484b1ddfe70dc1997148ba0e28515c310300000000ffffffff05275a52a23c59da91129093364e275da5616c4070d8a05b96df5a2080ef259500000000096aac51656a6aac53ab66e64966b3b36a07dd2bb40242dd4a3743d3026e7e1e0d9e9e18f11d068464b989661321030000000265ac383339c4fae63379cafb63b0bab2eca70e1f5fc7d857eb5c88ccd6c0465093924bba8b2a000000000300636ab5e0545402bc2c4c010000000000cd41c002000000000000000000", "abac635253656a00", 3, 2052372230, "32db877b6b1ca556c9e859442329406f0f8246706522369839979a9f7a235a32"],
                ["1d9c5df20139904c582285e1ea63dec934251c0f9cf5c47e86abfb2b394ebc57417a81f67c010000000353515222ba722504800d3402000000000353656a3c0b4a0200000000000fb8d20500000000076300ab005200516462f30400000000015200000000", "ab65", 0, -210854112, "edf73e2396694e58f6b619f68595b0c1cdcb56a9b3147845b6d6afdb5a80b736"],
                ["4504cb1904c7a4acf375ddae431a74de72d5436efc73312cf8e9921f431267ea6852f9714a01000000066a656a656553a2fbd587c098b3a1c5bd1d6480f730a0d6d9b537966e20efc0e352d971576d0f87df0d6d01000000016321aeec3c4dcc819f1290edb463a737118f39ab5765800547522708c425306ebfca3f396603000000055300ac656a1d09281d05bfac57b5eb17eb3fa81ffcedfbcd3a917f1be0985c944d473d2c34d245eb350300000007656a51525152ac263078d9032f470f0500000000066aac00000052e12da60200000000003488410200000000076365006300ab539981e432", "52536a52526a", 1, -31909119, "f0a2deee7fd8a3a9fad6927e763ded11c940ee47e9e6d410f94fda5001f82e0c"],
                ["14bc7c3e03322ec0f1311f4327e93059c996275302554473104f3f7b46ca179bfac9ef753503000000016affffffff9d405eaeffa1ca54d9a05441a296e5cc3a3e32bb8307afaf167f7b57190b07e00300000008abab51ab5263abab45533aa242c61bca90dd15d46079a0ab0841d85df67b29ba87f2393cd764a6997c372b55030000000452005263ffffffff0250f40e02000000000651516a0063630e95ab0000000000046a5151ac00000000", "6a65005151", 0, -1460947095, "aa418d096929394c9147be8818d8c9dafe6d105945ab9cd7ec682df537b5dd79"],
                ["2b3bd0dd04a1832f893bf49a776cd567ec4b43945934f4786b615d6cb850dfc0349b33301a000000000565ac000051cf80c670f6ddafab63411adb4d91a69c11d9ac588898cbfb4cb16061821cc104325c895103000000025163ffffffffa9e2d7506d2d7d53b882bd377bbcc941f7a0f23fd15d2edbef3cd9df8a4c39d10200000009ac63006a52526a5265ffffffff44c099cdf10b10ce87d4b38658d002fd6ea17ae4a970053c05401d86d6e75f99000000000963ab53526a5252ab63ffffffff035af69c01000000000100ba9b8b0400000000004cead10500000000026a520b77d667", "ab52abac526553", 3, -1955078165, "eb9ceecc3b401224cb79a44d23aa8f428e29f1405daf69b4e01910b848ef1523"],
                ["35df11f004a48ba439aba878fe9df20cc935b4a761c262b1b707e6f2b33e2bb7565cd68b130000000000ffffffffb2a2f99abf64163bb57ca900500b863f40c02632dfd9ea2590854c5fb4811da90200000006ac006363636affffffffaf9d89b2a8d2670ca37c8f7c140600b81259f2e037cb4590578ec6e37af8bf200000000005abac6a655270a4751eb551f058a93301ffeda2e252b6614a1fdd0e283e1d9fe53c96c5bbaafaac57b8030000000153ffffffff020d9f3b02000000000100ed7008030000000004abac000000000000", "abac", 3, 593793071, "88fdee1c2d4aeead71d62396e28dc4d00e5a23498eea66844b9f5d26d1f21042"],
                ["a08ff466049fb7619e25502ec22fedfb229eaa1fe275aa0b5a23154b318441bf547989d0510000000005ab5363636affffffff2b0e335cb5383886751cdbd993dc0720817745a6b1c9b8ab3d15547fc9aafd03000000000965656a536a52656a532b53d10584c290d3ac1ab74ab0a19201a4a039cb59dc58719821c024f6bf2eb26322b33f010000000965ac6aac0053ab6353ffffffff048decba6ebbd2db81e416e39dde1f821ba69329725e702bcdea20c5cc0ecc6402000000086363ab5351ac6551466e377b0468c0fa00000000000651ab53ac6a513461c6010000000008636a636365535100eeb3dc010000000006526a52ac516a43f362010000000005000063536500000000", "0063516a", 1, -1158911348, "f6a1ecb50bd7c2594ebecea5a1aa23c905087553e40486dade793c2f127fdfae"],
                ["5ac2f17d03bc902e2bac2469907ec7d01a62b5729340bc58c343b7145b66e6b97d434b30fa000000000163ffffffff44028aa674192caa0d0b4ebfeb969c284cb16b80c312d096efd80c6c6b094cca000000000763acabac516a52ffffffff10c809106e04b10f9b43085855521270fb48ab579266e7474657c6c625062d2d030000000351636595a0a97004a1b69603000000000465ab005352ad68010000000008636a5263acac5100da7105010000000002acab90325200000000000000000000", "6a6aab516a63526353", 2, 1518400956, "f7efb74b1dcc49d316b49c632301bc46f98d333c427e55338be60c7ef0d953be"],
                ["aeb2e11902dc3770c218b97f0b1960d6ee70459ecb6a95eff3f05295dc1ef4a0884f10ba460300000005516352526393e9b1b3e6ae834102d699ddd3845a1e159aa7cf7635edb5c02003f7830fee3788b795f20100000009ab006a526553ac006ad8809c570469290e0400000000050000abab00b10fd5040000000008ab655263abac53ab630b180300000000009d9993040000000002516300000000", "5351ababac6a65", 0, 1084852870, "f2286001af0b0170cbdad92693d0a5ebaa8262a4a9d66e002f6d79a8c94026d1"],
                ["9860ca9a0294ff4812534def8c3a3e3db35b817e1a2ddb7f0bf673f70eab71bb79e90a2f3100000000086a636551acac5165ffffffffed4d6d3cd9ff9b2d490e0c089739121161a1445844c3e204296816ab06e0a83702000000035100ac88d0db5201c3b59a050000000005ac6a0051ab00000000", "535263ab006a526aab", 1, -962088116, "30df2473e1403e2b8e637e576825f785528d998af127d501556e5f7f5ed89a2a"],
                ["4ddaa680026ec4d8060640304b86823f1ac760c260cef81d85bd847952863d629a3002b54b0200000008526365636a656aab65457861fc6c24bdc760c8b2e906b6656edaf9ed22b5f50e1fb29ec076ceadd9e8ebcb6b000000000152ffffffff033ff04f00000000000551526a00657a1d900300000000002153af040000000003006a6300000000", "ab526a53acabab", 0, 1055317633, "7f21b62267ed52462e371a917eb3542569a4049b9dfca2de3c75872b39510b26"],
                ["01e76dcd02ad54cbc8c71d68eaf3fa7c883b65d74217b30ba81f1f5144ef80b706c0dc82ca000000000352ab6a078ec18bcd0514825feced2e8b8ea1ccb34429fae41c70cc0b73a2799e85603613c6870002000000086363ab6365536a53ffffffff043acea90000000000016ad20e1803000000000100fa00830200000000056352515351e864ee00000000000865535253ab6a6551d0c46672", "6a6365abacab", 0, -1420559003, "8af0b4cbdbc011be848edf4dbd2cde96f0578d662cfebc42252495387114224a"],
                ["fa00b26402670b97906203434aa967ce1559d9bd097d56dbe760469e6032e7ab61accb54160100000006635163630052fffffffffe0d3f4f0f808fd9cfb162e9f0c004601acf725cd7ea5683bbdc9a9a433ef15a0200000005ab52536563d09c7bef049040f305000000000153a7c7b9020000000004ac63ab52847a2503000000000553ab00655390ed80010000000005006553ab52860671d4", "536565ab52", 0, 799022412, "40ed8e7bbbd893e15f3cce210ae02c97669818de5946ca37eefc7541116e2c78"],
                ["cb5c06dc01b022ee6105ba410f0eb12b9ce5b5aa185b28532492d839a10cef33d06134b91b010000000153ffffffff02cec0530400000000005e1e4504000000000865656551acacac6a00000000", "ab53", 0, -1514251329, "136beb95459fe6b126cd6cefd54eb5d971524b0e883e41a292a78f78015cb8d5"],
                ["f10a0356031cd569d652dbca8e7a4d36c8da33cdff428d003338602b7764fe2c96c505175b010000000465ac516affffffffbb54563c71136fa944ee20452d78dc87073ac2365ba07e638dce29a5d179da600000000003635152ffffffff9a411d8e2d421b1e6085540ee2809901e590940bbb41532fa38bd7a16b68cc350100000007535251635365636195df1603b61c45010000000002ab65bf6a310400000000026352fcbba10200000000016aa30b7ff0", "5351", 0, 1552495929, "9eb8adf2caecb4bf9ac59d7f46bd20e83258472db2f569ee91aba4cf5ee78e29"],
                ["c3325c9b012f659466626ca8f3c61dfd36f34670abc054476b7516a1839ec43cd0870aa0c0000000000753525265005351e7e3f04b0112650500000000000363ac6300000000", "acac", 0, -68961433, "5ca70e727d91b1a42b78488af2ed551642c32d3de4712a51679f60f1456a8647"],
                ["2333e54c044370a8af16b9750ac949b151522ea6029bacc9a34261599549581c7b4e5ece470000000007510052006563abffffffff80630fc0155c750ce20d0ca4a3d0c8e8d83b014a5b40f0b0be0dd4c63ac28126020000000465000000ffffffff1b5f1433d38cdc494093bb1d62d84b10abbdae57e3d04e82e600857ab3b1dc990300000003515100b76564be13e4890a908ea7508afdad92ec1b200a9a67939fadce6eb7a29eb4550a0a28cb0300000001acffffffff02926c930300000000016373800201000000000153d27ee740", "ab6365ab516a53", 3, 598653797, "2be27a686eb7940dd32c44ff3a97c1b28feb7ab9c5c0b1593b2d762361cfc2db"],
                ["b500ca48011ec57c2e5252e5da6432089130603245ffbafb0e4c5ffe6090feb629207eeb0e010000000652ab6a636aab8302c9d2042b44f40500000000015278c05a050000000004ac5251524be080020000000007636aac63ac5252c93a9a04000000000965ab6553636aab5352d91f9ddb", "52005100", 0, -2024394677, "49c8a6940a461cc7225637f1e512cdd174c99f96ec05935a59637ededc77124c"],
                ["f52ff64b02ee91adb01f3936cc42e41e1672778962b68cf013293d649536b519bc3271dd2c00000000020065afee11313784849a7c15f44a61cd5fd51ccfcdae707e5896d131b082dc9322a19e12858501000000036aac654e8ca882022deb7c020000000006006a515352abd3defc0000000000016300000000", "63520063", 0, 1130989496, "7f208df9a5507e98c62cebc5c1e2445eb632e95527594929b9577b53363e96f6"],
                ["ab7d6f36027a7adc36a5cf7528fe4fb5d94b2c96803a4b38a83a675d7806dda62b380df86a0000000003000000ffffffff5bc00131e29e22057c04be854794b4877dda42e416a7a24706b802ff9da521b20000000007ac6a0065ac52ac957cf45501b9f06501000000000500ac6363ab25f1110b", "00526500536a635253", 0, 911316637, "5fa09d43c8aef6f6fa01c383a69a5a61a609cd06e37dce35a39dc9eae3ddfe6c"],
                ["f940888f023dce6360263c850372eb145b864228fdbbb4c1186174fa83aab890ff38f8c9a90300000000ffffffff01e80ccdb081e7bbae1c776531adcbfb77f2e5a7d0e5d0d0e2e6c8758470e85f00000000020053ffffffff03b49088050000000004656a52ab428bd604000000000951630065ab63ac636a0cbacf0400000000070063ac5265ac53d6e16604", "ac63", 0, 39900215, "713ddeeefcfe04929e7b6593c792a4efbae88d2b5280d1f0835d2214eddcbad6"],
                ["530ecd0b01ec302d97ef6f1b5a6420b9a239714013e20d39aa3789d191ef623fc215aa8b940200000005ac5351ab6a3823ab8202572eaa04000000000752ab6a51526563fd8a270100000000036a006581a798f0", "525153656a0063", 0, 1784562684, "fe42f73a8742676e640698222b1bd6b9c338ff1ccd766d3d88d7d3c6c6ac987e"],
                ["5d781d9303acfcce964f50865ddfddab527ea971aee91234c88e184979985c00b4de15204b0100000003ab6352a009c8ab01f93c8ef2447386c434b4498538f061845862c3f9d5751ad0fce52af442b3a902000000045165ababb909c66b5a3e7c81b3c45396b944be13b8aacfc0204f3f3c105a66fa8fa6402f1b5efddb01000000096a65ac636aacab656ac3c677c402b79fa4050000000004006aab5133e35802000000000751ab635163ab0078c2e025", "6aac51636a6a005265", 0, -882306874, "551ce975d58647f10adefb3e529d9bf9cda34751627ec45e690f135ef0034b95"],
                ["25ee54ef0187387564bb86e0af96baec54289ca8d15e81a507a2ed6668dc92683111dfb7a50100000004005263634cecf17d0429aa4d000000000007636a6aabab5263daa75601000000000251ab4df70a01000000000151980a890400000000065253ac6a006377fd24e3", "65ab", 0, 797877378, "069f38fd5d47abff46f04ee3ae27db03275e9aa4737fa0d2f5394779f9654845"],
                ["a9c57b1a018551bcbc781b256642532bbc09967f1cbe30a227d352a19365d219d3f11649a3030000000451655352b140942203182894030000000006ab00ac6aab654add350400000000003d379505000000000553abacac00e1739d36", "5363", 0, -1069721025, "6da32416deb45a0d720a1dbe6d357886eabc44029dd5db74d50feaffbe763245"],
                ["05c4fb94040f5119dc0b10aa9df054871ed23c98c890f1e931a98ffb0683dac45e98619fdc0200000007acab6a525263513e7495651c9794c4d60da835d303eb4ee6e871f8292f6ad0b32e85ef08c9dc7aa4e03c9c010000000500ab52acacfffffffffee953259cf14ced323fe8d567e4c57ba331021a1ef5ac2fa90f7789340d7c550100000007ac6aacac6a6a53ffffffff08d9dc820d00f18998af247319f9de5c0bbd52a475ea587f16101af3afab7c210100000003535363569bca7c0468e34f00000000000863536353ac51ac6584e319010000000006650052ab6a533debea030000000003ac0053ee7070020000000006ac52005253ac00000000", "6351005253", 2, 1386916157, "76c4013c40bfa1481badd9d342b6d4b8118de5ab497995fafbf73144469e5ff0"],
                ["c95ab19104b63986d7303f4363ca8f5d2fa87c21e3c5d462b99f1ebcb7c402fc012f5034780000000009006aac63ac65655265ffffffffbe91afa68af40a8700fd579c86d4b706c24e47f7379dad6133de389f815ef7f501000000046aac00abffffffff1520db0d81be4c631878494668d258369f30b8f2b7a71e257764e9a27f24b48701000000076a515100535300b0a989e1164db9499845bac01d07a3a7d6d2c2a76e4c04abe68f808b6e2ef5068ce6540e0100000009ac53636a63ab65656affffffff0309aac6050000000005ab6563656a6067e8020000000003ac536aec91c8030000000009655251ab65ac6a53acc7a45bc5", "63526a65abac", 1, 512079270, "fb7eca81d816354b6aedec8cafc721d5b107336657acafd0d246049556f9e04b"],
                ["ca66ae10049533c2b39f1449791bd6d3f039efe0a121ab7339d39ef05d6dcb200ec3fb2b3b020000000465006a53ffffffff534b8f97f15cc7fb4f4cea9bf798472dc93135cd5b809e4ca7fe4617a61895980100000000ddd83c1dc96f640929dd5e6f1151dab1aa669128591f153310d3993e562cc7725b6ae3d903000000046a52536582f8ccddb8086d8550f09128029e1782c3f2624419abdeaf74ecb24889cc45ac1a64492a0100000002516a4867b41502ee6ccf03000000000752acacab52ab6a4b7ba80000000000075151ab0052536300000000", "6553", 2, -62969257, "8085e904164ab9a8c20f58f0d387f6adb3df85532e11662c03b53c3df8c943cb"],
                ["ba646d0b0453999f0c70cb0430d4cab0e2120457bb9128ed002b6e9500e9c7f8d7baa20abe0200000001652a4e42935b21db02b56bf6f08ef4be5adb13c38bc6a0c3187ed7f6197607ba6a2c47bc8a03000000040052516affffffffa55c3cbfc19b1667594ac8681ba5d159514b623d08ed4697f56ce8fcd9ca5b0b00000000096a6a5263ac655263ab66728c2720fdeabdfdf8d9fb2bfe88b295d3b87590e26a1e456bad5991964165f888c03a0200000006630051ac00acffffffff0176fafe0100000000070063acac65515200000000", "63", 1, 2002322280, "9db4e320208185ee70edb4764ee195deca00ba46412d5527d9700c1cf1c3d057"],
                ["2ddb8f84039f983b45f64a7a79b74ff939e3b598b38f436def7edd57282d0803c7ef34968d02000000026a537eb00c4187de96e6e397c05f11915270bcc383959877868ba93bac417d9f6ed9f627a7930300000004516551abffffffffacc12f1bb67be3ae9f1d43e55fda8b885340a0df1175392a8bbd9f959ad3605003000000025163ffffffff02ff0f4700000000000070bd99040000000003ac53abf8440b42", "", 2, -393923011, "0133f1a161363b71dfb3a90065c7128c56bd0028b558b610142df79e055ab5c7"],
                ["b21fc15403b4bdaa994204444b59323a7b8714dd471bd7f975a4e4b7b48787e720cbd1f5f00000000000ffffffff311533001cb85c98c1d58de0a5fbf27684a69af850d52e22197b0dc941bc6ca9030000000765ab6363ab5351a8ae2c2c7141ece9a4ff75c43b7ea9d94ec79b7e28f63e015ac584d984a526a73fe1e04e0100000007526352536a5365ffffffff02a0a9ea030000000002ab52cfc4f300000000000465525253e8e0f342", "000000", 1, 1305253970, "d1df1f4bba2484cff8a816012bb6ec91c693e8ca69fe85255e0031711081c46a"],
                ["d1704d6601acf710b19fa753e307cfcee2735eada0d982b5df768573df690f460281aad12d0000000007656300005100acffffffff0232205505000000000351ab632ca1bc0300000000016300000000", "ac65ab65ab51", 0, 165179664, "40b4f03c68288bdc996011b0f0ddb4b48dc3be6762db7388bdc826113266cd6c"],
                ["d2f6c096025cc909952c2400bd83ac3d532bfa8a1f8f3e73c69b1fd7b8913379793f3ce92202000000076a00ab6a53516ade5332d81d58b22ed47b2a249ab3a2cb3a6ce9a6b5a6810e18e3e1283c1a1b3bd73e3ab00300000002acabffffffff01a9b2d40500000000056352abab00dc4b7f69", "ab0065", 0, -78019184, "2ef025e907f0fa454a2b48a4f3b81346ba2b252769b5c35d742d0c8985e0bf5e"],
                ["3e6db1a1019444dba461247224ad5933c997256d15c5d37ade3d700506a0ba0a57824930d7010000000852ab6500ab00ac00ffffffff03389242020000000001aba8465a0200000000086a6a636a5100ab52394e6003000000000953ac51526351000053d21d9800", "abababacab53ab65", 0, 1643661850, "1f8a3aca573a609f4aea0c69522a82fcb4e15835449da24a05886ddc601f4f6a"],
                ["f821a042036ad43634d29913b77c0fc87b4af593ac86e9a816a9d83fd18dfcfc84e1e1d57102000000076a63ac52006351ffffffffbcdaf490fc75086109e2f832c8985716b3a624a422cf9412fe6227c10585d21203000000095252abab5352ac526affffffff2efed01a4b73ad46c7f7bc7fa3bc480f8e32d741252f389eaca889a2e9d2007e000000000353ac53ffffffff032ac8b3020000000009636300000063516300d3d9f2040000000006510065ac656aafa5de0000000000066352ab5300ac9042b57d", "525365", 1, 667065611, "0d17a92c8d5041ba09b506ddf9fd48993be389d000aad54f9cc2a44fcc70426b"],
                ["58e3f0f704a186ef55d3919061459910df5406a9121f375e7502f3be872a449c3f2bb058380100000000f0e858da3ac57b6c973f889ad879ffb2bd645e91b774006dfa366c74e2794aafc8bbc871010000000751ac65516a515131a68f120fd88ca08687ceb4800e1e3fbfea7533d34c84fef70cc5a96b648d580369526d000000000600ac00515363f6191d5b3e460fa541a30a6e83345dedfa3ed31ad8574d46d7bbecd3c9074e6ba5287c24020000000151e3e19d6604162602010000000004005100ac71e17101000000000065b5e90300000000040053ab53f6b7d101000000000200ac00000000", "6563ab", 1, -669018604, "8221d5dfb75fc301a80e919e158e0b1d1e86ffb08870a326c89408d9bc17346b"],
                ["efec1cce044a676c1a3d973f810edb5a9706eb4cf888a240f2b5fb08636bd2db482327cf500000000005ab51656a52ffffffff46ef019d7c03d9456e5134eb0a7b5408d274bd8e33e83df44fab94101f7c5b650200000009ac5100006353630051407aadf6f5aaffbd318fdbbc9cae4bd883e67d524df06bb006ce2f7c7e2725744afb76960100000005536aab53acec0d64eae09e2fa1a7c4960354230d51146cf6dc45ee8a51f489e20508a785cbe6ca86fc000000000651536a516300ffffffff014ef598020000000006636aac655265a6ae1b75", "53516a5363526563ab", 2, -1823982010, "13e8b5ab4e5b2ceeff0045c625e19898bda2d39fd7af682e2d1521303cfe1154"],
                ["3c436c2501442a5b700cbc0622ee5143b34b1b8021ea7bbc29e4154ab1f5bdfb3dff9d640501000000086aab5251ac5252acffffffff0170b9a20300000000066aab6351525114b13791", "63acabab52ab51ac65", 0, -2140612788, "87ddf1f9acb6640448e955bd1968f738b4b3e073983af7b83394ab7557f5cd61"],
                ["d62f183e037e0d52dcf73f9b31f70554bce4f693d36d17552d0e217041e01f15ad3840c838000000000963acac6a6a6a63ab63ffffffffabdfb395b6b4e63e02a763830f536fc09a35ff8a0cf604021c3c751fe4c88f4d0300000006ab63ab65ac53aa4d30de95a2327bccf9039fb1ad976f84e0b4a0936d82e67eafebc108993f1e57d8ae39000000000165ffffffff04364ad30500000000036a005179fd84010000000007ab636aac6363519b9023030000000008510065006563ac6acd2a4a02000000000000000000", "52", 1, 595020383, "da8405db28726dc4e0f82b61b2bfd82b1baa436b4e59300305cc3b090b157504"],
                ["44c200a5021238de8de7d80e7cce905606001524e21c8d8627e279335554ca886454d692e6000000000500acac52abbb8d1dc876abb1f514e96b21c6e83f429c66accd961860dc3aed5071e153e556e6cf076d02000000056553526a51870a928d0360a580040000000004516a535290e1e302000000000851ab6a00510065acdd7fc5040000000007515363ab65636abb1ec182", "6363", 0, -785766894, "ed53cc766cf7cb8071cec9752460763b504b2183442328c5a9761eb005c69501"],
                ["d682d52d034e9b062544e5f8c60f860c18f029df8b47716cabb6c1b4a4b310a0705e754556020000000400656a0016eeb88eef6924fed207fba7ddd321ff3d84f09902ff958c815a2bf2bb692eb52032c4d803000000076365ac516a520099788831f8c8eb2552389839cfb81a9dc55ecd25367acad4e03cfbb06530f8cccf82802701000000085253655300656a53ffffffff02d543200500000000056a510052ac03978b05000000000700ac51525363acfdc4f784", "", 2, -696035135, "e1a256854099907050cfee7778f2018082e735a1f1a3d91437584850a74c87bb"],
                ["e8c0dec5026575ddf31343c20aeeca8770afb33d4e562aa8ee52eeda6b88806fdfd4fe0a97030000000953acabab65ab516552ffffffffdde122c2c3e9708874286465f8105f43019e837746686f442666629088a970e0010000000153ffffffff01f98eee0100000000025251fe87379a", "63", 1, 633826334, "abe441209165d25bc6d8368f2e7e7dc21019056719fef1ace45542aa2ef282e2"],
                ["b288c331011c17569293c1e6448e33a64205fc9dc6e35bc756a1ac8b97d18e912ea88dc0770200000007635300ac6aacabfc3c890903a3ccf8040000000004656500ac9c65c9040000000009ab6a6aabab65abac63ac5f7702000000000365005200000000", "526a63", 0, 1574937329, "0dd1bd5c25533bf5f268aa316ce40f97452cca2061f0b126a59094ca5b65f7a0"],
                ["fc0a092003cb275fa9a25a72cf85d69c19e4590bfde36c2b91cd2c9c56385f51cc545530210000000004ab530063ffffffff729b006eb6d14d6e5e32b1c376acf1c62830a5d9246da38dbdb4db9f51fd1c74020000000463636500ffffffff0ae695c6d12ab7dcb8d3d4b547b03f178c7268765d1de9af8523d244e3836b12030000000151ffffffff0115c1e20100000000066a6aabac6a6a1ff59aec", "ab0053ac", 0, 931831026, "73fe22099c826c34a74edf45591f5d7b3a888c8178cd08facdfd96a9a681261c"],
                ["0fcae7e004a71a4a7c8f66e9450c0c1785268679f5f1a2ee0fb3e72413d70a9049ecff75de020000000452005251ffffffff99c8363c4b95e7ec13b8c017d7bb6e80f7c04b1187d6072961e1c2479b1dc0320200000000ffffffff7cf03b3d66ab53ed740a70c5c392b84f780fff5472aee82971ac3bfeeb09b2df0200000006ab5265636a0058e4fe9257d7c7c7e82ff187757c6eadc14cceb6664dba2de03a018095fd3006682a5b9600000000056353536a636de26b2303ff76de010000000001acdc0a2e020000000001ab0a53ed020000000007530063ab51510088417307", "ac6aacab5165535253", 2, -902160694, "eea96a48ee572aea33d75d0587ce954fcfb425531a7da39df26ef9a6635201be"],
                ["612701500414271138e30a46b7a5d95c70c78cc45bf8e40491dac23a6a1b65a51af04e6b94020000000451655153ffffffffeb72dc0e49b2fad3075c19e1e6e4b387f1365dca43d510f6a02136318ddecb7f0200000003536352e115ffc4f9bae25ef5baf534a890d18106fb07055c4d7ec9553ba89ed1ac2101724e507303000000080063006563acabac2ff07f69a080cf61a9d19f868239e6a4817c0eeb6a4f33fe254045d8af2bca289a8695de0300000000430736c404d317840500000000086a00abac5351ab65306e0503000000000963ab0051536aabab6a6c8aca01000000000565516351ab5dcf960100000000016a00000000", "ab", 2, -604581431, "5ec805e74ee934aa815ca5f763425785ae390282d46b5f6ea076b6ad6255a842"],
                ["6b68ba00023bb4f446365ea04d68d48539aae66f5b04e31e6b38b594d2723ab82d44512460000000000200acffffffff5dfc6febb484fff69c9eeb7c7eb972e91b6d949295571b8235b1da8955f3137b020000000851ac6352516a535325828c8a03365da801000000000800636aabac6551ab0f594d03000000000963ac536365ac63636a45329e010000000005abac53526a00000000", "005151", 0, 1317038910, "42f5ba6f5fe1e00e652a08c46715871dc4b40d89d9799fd7c0ea758f86eab6a7"],
                ["aff5850c0168a67296cc790c1b04a9ed9ad1ba0469263a9432fcb53676d1bb4e0eea8ea1410100000005ac65526a537d5fcb1d01d9c26d0200000000065265ab5153acc0617ca1", "51ab650063", 0, 1712981774, "8449d5247071325e5f8edcc93cb9666c0fecabb130ce0e5bef050575488477eb"],
                ["e6d6b9d8042c27aec99af8c12b6c1f7a80453e2252c02515e1f391da185df0874e133696b50300000006ac5165650065ffffffff6a4b60a5bfe7af72b198eaa3cde2e02aa5fa36bdf5f24ebce79f6ecb51f3b554000000000652656aababac2ec4c5a6cebf86866b1fcc4c5bd5f4b19785a8eea2cdfe58851febf87feacf6f355324a80100000001537100145149ac1e287cef62f6f5343579189fad849dd33f25c25bfca841cb696f10c5a34503000000046a636a63df9d7c4c018d96e20100000000015100000000", "53ab", 1, -1924777542, "f98f95d0c5ec3ac3e699d81f6c440d2e7843eab15393eb023bc5a62835d6dcea"],
                ["046ac25e030a344116489cc48025659a363da60bc36b3a8784df137a93b9afeab91a04c1ed020000000951ab0000526a65ac51ffffffff6c094a03869fde55b9a8c4942a9906683f0a96e2d3e5a03c73614ea3223b2c29020000000500ab636a6affffffff3da7aa5ecef9071600866267674b54af1740c5aeb88a290c459caa257a2683cb0000000004ab6565ab7e2a1b900301b916030000000005abac63656308f4ed03000000000852ab53ac63ac51ac73d620020000000003ab00008deb1285", "6a", 2, 1299505108, "f79e6b776e2592bad45ca328c54abf14050c241d8f822d982c36ea890fd45757"],
                ["bd515acd0130b0ac47c2d87f8d65953ec7d657af8d96af584fc13323d0c182a2e5f9a96573000000000652ac51acac65ffffffff0467aade000000000003655363dc577d050000000006515252ab5300137f60030000000007535163530065004cdc860500000000036a5265241bf53e", "acab", 0, 621090621, "771d4d87f1591a13d77e51858c16d78f1956712fe09a46ff1abcabbc1e7af711"],
                ["ff1ae37103397245ac0fa1c115b079fa20930757f5b6623db3579cb7663313c2dc4a3ffdb300000000076353656a000053ffffffff83c59e38e5ad91216ee1a312d15b4267bae2dd2e57d1a3fd5c2f0f809eeb5d46010000000800abab6a6a53ab51ffffffff9d5e706c032c1e0ca75915f8c6686f64ec995ebcd2539508b7dd8abc3e4d7d2a01000000006b2bdcda02a8fe070500000000045253000019e31d04000000000700ab63acab526a00000000", "53656aab6a525251", 0, 881938872, "726bb88cdf3af2f7603a31f33d2612562306d08972a4412a55dbbc0e3363721c"],
                ["ff5400dd02fec5beb9a396e1cbedc82bedae09ed44bae60ba9bef2ff375a6858212478844b03000000025253ffffffff01e46c203577a79d1172db715e9cc6316b9cfc59b5e5e4d9199fef201c6f9f0f000000000900ab6552656a5165acffffffff02e8ce62040000000002515312ce3e00000000000251513f119316", "", 0, 1541581667, "1e0da47eedbbb381b0e0debbb76e128d042e02e65b11125e17fd127305fc65cd"],
                ["28e3daa603c03626ad91ffd0ff927a126e28d29db5012588b829a06a652ea4a8a5732407030200000004ab6552acffffffff8e643146d3d0568fc2ad854fd7864d43f6f16b84e395db82b739f6f5c84d97b40000000004515165526b01c2dc1469db0198bd884e95d8f29056c48d7e74ff9fd37a9dec53e44b8769a6c99c030200000009ab006a516a53630065eea8738901002398000000000007ac5363516a51abeaef12f5", "52ab52515253ab", 2, 1687390463, "55591346aec652980885a558cc5fc2e3f8d21cbd09f314a798e5a7ead5113ea6"],
                ["b54bf5ac043b62e97817abb892892269231b9b220ba08bc8dbc570937cd1ea7cdc13d9676c010000000451ab5365a10adb7b35189e1e8c00b86250f769319668189b7993d6bdac012800f1749150415b2deb0200000003655300ffffffff60b9f4fb9a7e17069fd00416d421f804e2ef2f2c67de4ca04e0241b9f9c1cc5d0200000003ab6aacfffffffff048168461cce1d40601b42fbc5c4f904ace0d35654b7cc1937ccf53fe78505a0100000008526563525265abacffffffff01dbf4e6040000000007acac656553636500000000", "63", 2, 882302077, "f5b38b0f06e246e47ce622e5ee27d5512c509f8ac0e39651b3389815eff2ab93"],
                ["ebf628b30360bab3fa4f47ce9e0dcbe9ceaf6675350e638baff0c2c197b2419f8e4fb17e16000000000452516365ac4d909a79be207c6e5fb44fbe348acc42fc7fe7ef1d0baa0e4771a3c4a6efdd7e2c118b0100000003acacacffffffffa6166e9101f03975721a3067f1636cc390d72617be72e5c3c4f73057004ee0ee010000000863636a6a516a5252c1b1e82102d8d54500000000000153324c900400000000015308384913", "0063516a51", 1, -1658428367, "eb2d8dea38e9175d4d33df41f4087c6fea038a71572e3bad1ea166353bf22184"],
                ["d6a8500303f1507b1221a91adb6462fb62d741b3052e5e7684ea7cd061a5fc0b0e93549fa50100000004acab65acfffffffffdec79bf7e139c428c7cfd4b35435ae94336367c7b5e1f8e9826fcb0ebaaaea30300000000ffffffffd115fdc00713d52c35ea92805414bd57d1e59d0e6d3b79a77ee18a3228278ada020000000453005151ffffffff040231510300000000085100ac6a6a000063c6041c0400000000080000536a6563acac138a0b04000000000263abd25fbe03000000000900656a00656aac510000000000", "ac526aac6a00", 1, -2007972591, "13d12a51598b34851e7066cd93ab8c5212d60c6ed2dae09d91672c10ccd7f87c"],
                ["658cb1c1049564e728291a56fa79987a4ed3146775fce078bd2e875d1a5ca83baf6166a82302000000056a656351ab2170e7d0826cbdb45fda0457ca7689745fd70541e2137bb4f52e7b432dcfe2112807bd720300000007006a0052536351ffffffff8715ca2977696abf86d433d5c920ef26974f50e9f4a20c584fecbb68e530af5101000000009e49d864155bf1d3c757186d29f3388fd89c7f55cc4d9158b4cf74ca27a35a1dd93f945502000000096a535353ac656351510d29fa870230b809040000000006ab6a6a526a633b41da050000000004ab6a6a65ed63bf62", "52acabac", 2, -1774073281, "53ab197fa7e27b8a3f99ff48305e67081eb90e95d89d7e92d80cee25a03a6689"],
                ["e92492cc01aec4e62df67ea3bc645e2e3f603645b3c5b353e4ae967b562d23d6e043badecd0100000003acab65ffffffff02c7e5ea040000000002ab52e1e584010000000005536365515195d16047", "6551", 0, -424930556, "93c34627f526d73f4bea044392d1a99776b4409f7d3d835f23b03c358f5a61c2"],
                ["02e242db04be2d8ced9179957e98cee395d4767966f71448dd084426844cbc6d15f2182e85030000000200650c8ffce3db9de9c3f9cdb9104c7cb26647a7531ad1ebf7591c259a9c9985503be50f8de30000000007ac6a51636a6353ffffffffa2e33e7ff06fd6469987ddf8a626853dbf30c01719efb259ae768f051f803cd30300000000fffffffffd69d8aead941683ca0b1ee235d09eade960e0b1df3cd99f850afc0af1b73e070300000001ab60bb602a011659670100000000076363526300acac00000000", "6353ab515251", 3, 1451100552, "bbc9069b8615f3a52ac8a77359098dcc6c1ba88c8372d5d5fe080b99eb781e55"],
                ["b28d5f5e015a7f24d5f9e7b04a83cd07277d452e898f78b50aae45393dfb87f94a26ef57720200000008ababac630053ac52ffffffff046475ed040000000008ab5100526363ac65c9834a04000000000251abae26b30100000000040000ac65ceefb900000000000000000000", "ac6551ac6a536553", 0, -1756558188, "5848d93491044d7f21884eef7a244fe7d38886f8ae60df49ce0dfb2a342cd51a"],
                ["efb8b09801f647553b91922a5874f8e4bb2ed8ddb3536ed2d2ed0698fac5e0e3a298012391030000000952ac005263ac52006affffffff04cdfa0f050000000007ac53ab51abac65b68d1b02000000000553ab65ac00d057d50000000000016a9e1fda010000000007ac63ac536552ac00000000", "6aac", 0, 1947322973, "603a9b61cd30fcea43ef0a5c18b88ca372690b971b379ee9e01909c336280511"],
                ["68a59fb901c21946797e7d07a4a3ea86978ce43df0479860d7116ac514ba955460bae78fff0000000001abffffffff03979be80100000000036553639300bc040000000008006552006a656565cfa78d0000000000076552acab63ab5100000000", "ab65ab", 0, 995583673, "3b320dd47f2702452a49a1288bdc74a19a4b849b132b6cad9a1d945d87dfbb23"],
                ["67761f2a014a16f3940dcb14a22ba5dc057fcffdcd2cf6150b01d516be00ef55ef7eb07a830100000004636a6a51ffffffff01af67bd050000000008526553526300510000000000", "6a00", 0, 1570943676, "079fa62e9d9d7654da8b74b065da3154f3e63c315f25751b4d896733a1d67807"],
                ["e20fe96302496eb436eee98cd5a32e1c49f2a379ceb71ada8a48c5382df7c8cd88bdc47ced03000000016556aa0e180660925a841b457aed0aae47fca2a92fa1d7afeda647abf67198a3902a7c80dd00000000085152ac636a535265bd18335e01803c810100000000046500ac52f371025e", "6363ab", 1, -651254218, "2921a0e5e3ba83c57ba57c25569380c17986bf34c366ec216d4188d5ba8b0b47"],
                ["4e1bd9fa011fe7aa14eee8e78f27c9fde5127f99f53d86bc67bdab23ca8901054ee8a8b6eb0300000009ac535153006a6a0063ffffffff044233670500000000000a667205000000000652ab636a51abe5bf35030000000003535351d579e505000000000700630065ab51ac3419ac30", "52abac52", 0, -1807563680, "4aae6648f856994bed252d319932d78db55da50d32b9008216d5366b44bfdf8a"],
                ["ec02fbee03120d02fde12574649660c441b40d330439183430c6feb404064d4f507e704f3c0100000000ffffffffe108d99c7a4e5f75cc35c05debb615d52fac6e3240a6964a29c1704d98017fb60200000002ab63fffffffff726ec890038977adfc9dadbeaf5e486d5fcb65dc23acff0dd90b61b8e2773410000000002ac65e9dace55010f881b010000000005ac00ab650000000000", "51ac525152ac6552", 2, -1564046020, "3f988922d8cd11c7adff1a83ce9499019e5ab5f424752d8d361cf1762e04269b"],
                ["23dbdcc1039c99bf11938d8e3ccec53b60c6c1d10c8eb6c31197d62c6c4e2af17f52115c3a0300000008636352000063ababffffffff17823880e1df93e63ad98c29bfac12e36efd60254346cac9d3f8ada020afc0620300000003ab63631c26f002ac66e86cd22a25e3ed3cb39d982f47c5118f03253054842daadc88a6c41a2e1500000000096a00ab636a53635163195314de015570fd0100000000096a5263acab5200005300000000", "ababac6a6553", 1, 11586329, "bd36a50e0e0a4ecbf2709e68daef41eddc1c0c9769efaee57910e99c0a1d1343"],
                ["33b03bf00222c7ca35c2f8870bbdef2a543b70677e413ce50494ac9b22ea673287b6aa55c50000000005ab00006a52ee4d97b527eb0b427e4514ea4a76c81e68c34900a23838d3e57d0edb5410e62eeb8c92b6000000000553ac6aacac42e59e170326245c000000000009656553536aab516aabb1a10603000000000852ab52ab6a516500cc89c802000000000763ac6a63ac516300000000", "", 0, 557416556, "41bead1b073e1e9fee065dd612a617ca0689e8f9d3fed9d0acfa97398ebb404c"],
                ["813eda1103ac8159850b4524ef65e4644e0fc30efe57a5db0c0365a30446d518d9b9aa8fdd0000000003656565c2f1e89448b374b8f12055557927d5b33339c52228f7108228149920e0b77ef0bcd69da60000000006abac00ab63ab82cdb7978d28630c5e1dc630f332c4245581f787936f0b1e84d38d33892141974c75b4750300000004ac53ab65ffffffff0137edfb02000000000000000000", "0063", 1, -1948560575, "71dfcd2eb7f2e6473aed47b16a6d5fcbd0af22813d892e9765023151e07771ec"],
                ["9e45d9aa0248c16dbd7f435e8c54ae1ad086de50c7b25795a704f3d8e45e1886386c653fbf01000000025352fb4a1acefdd27747b60d1fb79b96d14fb88770c75e0da941b7803a513e6d4c908c6445c7010000000163ffffffff014069a8010000000001520a794fb3", "51ac005363", 1, -719113284, "0d31a221c69bd322ef7193dd7359ddfefec9e0a1521d4a8740326d46e44a5d6a"],
                ["36e42018044652286b19a90e5dd4f8d9f361d0760d080c5c5add1970296ff0f1de630233c8010000000200ac39260c7606017d2246ee14ddb7611586178067e6a4be38e788e33f39a3a95a55a13a6775010000000352ac638bea784f7c2354ed02ea0b93f0240cdfb91796fa77649beee6f7027caa70778b091deee700000000066a65ac656363ffffffff4d9d77ab676d711267ef65363f2d192e1bd55d3cd37f2280a34c72e8b4c559d700000000056a006aab00001764e1020d30220100000000085252516aacab0053472097040000000009635353ab6a636a5100a56407a1", "006a536551ab53ab", 0, 827296034, "daec2af5622bbe220c762da77bab14dc75e7d28aa1ade9b7f100798f7f0fd97a"],
                ["5e06159a02762b5f3a5edcdfc91fd88c3bff08b202e69eb5ba74743e9f4291c4059ab008200000000001ac348f5446bb069ef977f89dbe925795d59fb5d98562679bafd61f5f5f3150c3559582992d0000000008ab5165515353abac762fc67703847ec6010000000000e200cf040000000002abaca64b86010000000008520000515363acabb82b491b", "ab53525352ab6a", 0, -61819505, "75a7db0df41485a28bf6a77a37ca15fa8eccc95b5d6014a731fd8adb9ada0f12"],
                ["a1948872013b543d6d902ccdeead231c585195214ccf5d39f136023855958436a43266911501000000086aac006a6a6a51514951c9b2038a538a04000000000452526563c0f345050000000007526a5252ac526af9be8e03000000000752acac51ab006306198db2", "ab6353", 0, -326384076, "ced7ef84aad4097e1eb96310e0d1c8e512cfcb392a01d9010713459b23bc0cf4"],
                ["c3efabba03cb656f154d1e159aa4a1a4bf9423a50454ebcef07bc3c42a35fb8ad84014864d0000000000d1cc73d260980775650caa272e9103dc6408bdacaddada6b9c67c88ceba6abaa9caa2f7d020000000553536a5265ffffffff9f946e8176d9b11ff854b76efcca0a4c236d29b69fb645ba29d406480427438e01000000066a0065005300ffffffff040419c0010000000003ab6a63cdb5b6010000000009006300ab5352656a63f9fe5e050000000004acac5352611b980100000000086a00acac00006a512d7f0c40", "0053", 0, -59089911, "c503001c16fbff82a99a18d88fe18720af63656fccd8511bca1c3d0d69bd7fc0"],
                ["efb55c2e04b21a0c25e0e29f6586be9ef09f2008389e5257ebf2f5251051cdc6a79fce2dac020000000351006affffffffaba73e5b6e6c62048ba5676d18c33ccbcb59866470bb7911ccafb2238cfd493802000000026563ffffffffe62d7cb8658a6eca8a8babeb0f1f4fa535b62f5fc0ec70eb0111174e72bbec5e0300000009abababac516365526affffffffbf568789e681032d3e3be761642f25e46c20322fa80346c1146cb47ac999cf1b0300000000b3dbd55902528828010000000001ab0aac7b0100000000015300000000", "acac52", 3, 1638140535, "e84444d91580da41c8a7dcf6d32229bb106f1be0c811b2292967ead5a96ce9d4"],
                ["91d3b21903629209b877b3e1aef09cd59aca6a5a0db9b83e6b3472aceec3bc2109e64ab85a0200000003530065ffffffffca5f92de2f1b7d8478b8261eaf32e5656b9eabbc58dcb2345912e9079a33c4cd010000000700ab65ab00536ad530611da41bbd51a389788c46678a265fe85737b8d317a83a8ff7a839debd18892ae5c80300000007ab6aac65ab51008b86c501038b8a9a05000000000263525b3f7a040000000007ab535353ab00abd4e3ff04000000000665ac51ab65630b7b656f", "6551525151516a00", 2, 499657927, "ef4bd7622eb7b2bbbbdc48663c1bc90e01d5bde90ff4cb946596f781eb420a0c"],
                ["5d5c41ad0317aa7e40a513f5141ad5fc6e17d3916eebee4ddb400ddab596175b41a111ead20100000005536a5265acffffffff900ecb5e355c5c9f278c2c6ea15ac1558b041738e4bffe5ae06a9346d66d5b2b00000000080000ab636a65ab6affffffff99f4e08305fa5bd8e38fb9ca18b73f7a33c61ff7b3c68e696b30a04fea87f3ca000000000163d3d1760d019fc13a00000000000000000000", "ab53acabab6aac6a52", 2, 1007461922, "4012f5ff2f1238a0eb84854074670b4703238ebc15bfcdcd47ffa8498105fcd9"],
                ["ceecfa6c02b7e3345445b82226b15b7a097563fa7d15f3b0c979232b138124b62c0be007890200000009abac51536a63525253ffffffffbae481ccb4f15d94db5ec0d8854c24c1cc8642bd0c6300ede98a91ca13a4539a0200000001ac50b0813d023110f5020000000006acabac526563e2b0d0040000000009656aac0063516a536300000000", "0063526500", 0, -1862053821, "e1600e6df8a6160a79ac32aa40bb4644daa88b5f76c0d7d13bf003327223f70c"],
                ["ae62d5fd0380c4083a26642159f51af24bf55dc69008e6b7769442b6a69a603edd980a33000000000005ab5100ab53ffffffff49d048324d899d4b8ed5e739d604f5806a1104fede4cb9f92cc825a7fa7b4bfe0200000005536a000053ffffffff42e5cea5673c650881d0b4005fa4550fd86de5f21509c4564a379a0b7252ac0e0000000007530000526a53525f26a68a03bfacc3010000000000e2496f000000000009ab5253acac52636563b11cc600000000000700510065526a6a00000000", "abab", 1, -1600104856, "05cf0ec9c61f1a15f651a0b3c5c221aa543553ce6c804593f43bb5c50bb91ffb"],
                ["f06f64af04fdcb830464b5efdb3d5ee25869b0744005375481d7b9d7136a0eb8828ad1f0240200000003516563fffffffffd3ba192dabe9c4eb634a1e3079fca4f072ee5ceb4b57deb6ade5527053a92c5000000000165ffffffff39f43401a36ba13a5c6dd7f1190e793933ae32ee3bf3e7bfb967be51e681af760300000009650000536552636a528e34f50b21183952cad945a83d4d56294b55258183e1627d6e8fb3beb8457ec36cadb0630000000005abab530052334a7128014bbfd10100000000085352ab006a63656afc424a7c", "53650051635253ac00", 2, 313255000, "d309da5afd91b7afa257cfd62df3ca9df036b6a9f4b38f5697d1daa1f587312b"],
                ["6dfd2f98046b08e7e2ef5fff153e00545faf7076699012993c7a30cb1a50ec528281a9022f030000000152ffffffff1f535e4851920b968e6c437d84d6ecf586984ebddb7d5db6ae035bd02ba222a8010000000651006a53ab51605072acb3e17939fa0737bc3ee43bc393b4acd58451fc4ffeeedc06df9fc649828822d5010000000253525a4955221715f27788d302382112cf60719be9ae159c51f394519bd5f7e70a4f9816c7020200000009526a6a51636aab656a36d3a5ff0445548e0100000000086a6a00516a52655167030b050000000004ac6a63525cfda8030000000000e158200000000000010000000000", "535263ac6a65515153", 3, 585774166, "72b7da10704c3ca7d1deb60c31b718ee12c70dc9dfb9ae3461edce50789fe2ba"],
                ["187eafed01389a45e75e9dda526d3acbbd41e6414936b3356473d1f9793d161603efdb45670100000002ab00ffffffff04371c8202000000000563630063523b3bde02000000000753516563006300e9e765010000000005516aac656a373f9805000000000665525352acab08d46763", "ab", 0, 122457992, "393aa6c758e0eed15fa4af6d9e2d7c63f49057246dbb92b4268ec24fc87301ca"],
                ["7d50b977035d50411d814d296da9f7965ddc56f3250961ca5ba805cadd0454e7c521e31b0300000000003d0416c2cf115a397bacf615339f0e54f6c35ffec95aa009284d38390bdde1595cc7aa7c0100000005ab52ac5365ffffffff4232c6e796544d5ac848c9dc8d25cfa74e32e847a5fc74c74d8f38ca51188562030000000653ac51006a51ffffffff016bd8bb00000000000465ab5253163526f3", "51ab526a00005353", 1, -1311316785, "60b7544319b42e4159976c35c32c2644f0adf42eff13be1dc2f726fc0b6bb492"],
                ["2a45cd1001bf642a2315d4a427eddcc1e2b0209b1c6abd2db81a800c5f1af32812de42032702000000050051525200ffffffff032177db050000000005530051abac49186f000000000004ab6aab00645c0000000000000765655263acabac00000000", "6a65", 0, -1774715722, "6a9ac3f7da4c7735fbc91f728b52ecbd602233208f96ac5592656074a5db118a"],
                ["479358c202427f3c8d19e2ea3def6d6d3ef2281b4a93cd76214f0c7d8f040aa042fe19f71f0300000001abffffffffa2709be556cf6ecaa5ef530df9e4d056d0ed57ce96de55a5b1f369fa40d4e74a020000000700006a51635365c426be3f02af578505000000000363ab63fd8f590500000000065153abac53632dfb14b3", "520063ab51", 1, -763226778, "cfe147982afacde044ce66008cbc5b1e9f0fd9b8ed52b59fc7c0fecf95a39b0e"],
                ["76179a8e03bec40747ad65ab0f8a21bc0d125b5c3c17ad5565556d5cb03ade7c83b4f32d98030000000151ffffffff99b900504e0c02b97a65e24f3ad8435dfa54e3c368f4e654803b756d011d24150200000003ac5353617a04ac61bb6cf697cfa4726657ba35ed0031432da8c0ffb252a190278830f9bd54f0320100000006656551005153c8e8fc8803677c77020000000007ac6553535253ac70f442030000000001535be0f20200000000026300bf46cb3a", "6aab52", 1, -58495673, "35e94b3776a6729d20aa2f3ddeeb06d3aad1c14cc4cde52fd21a4efc212ea16c"],
                ["75ae53c2042f7546223ce5d5f9e00a968ddc68d52e8932ef2013fa40ce4e8c6ed0b6195cde01000000056563ac630079da0452c20697382e3dba6f4fc300da5f52e95a9dca379bb792907db872ba751b8024ee0300000009655151536500005163ffffffffe091b6d43f51ff00eff0ccfbc99b72d3aff208e0f44b44dfa5e1c7322cfc0c5f01000000075200005363ab63ffffffff7e96c3b83443260ac5cfd18258574fbc4225c630d3950df812bf51dceaeb0f9103000000065365655165639a6bf70b01b3e14305000000000563530063ac00000000", "6300ab00ac", 2, 982422189, "ee4ea49d2aae0dbba05f0b9785172da54408eb1ec67d36759ff7ed25bfc28766"],
                ["1cdfa01e01e1b8078e9c2b0ca5082249bd18fdb8b629ead659adedf9a0dd5a04031871ba120200000008525351536565ab6affffffff011e28430200000000076a5363636aac52b2febd4a", "abacac63656300", 0, 387396350, "299dcaac2bdaa627eba0dfd74767ee6c6f27c9200b49da8ff6270b1041669e7e"],
                ["cc28c1810113dfa6f0fcd9c7d9c9a30fb6f1d774356abeb527a8651f24f4e6b25cf763c4e00300000003ab636affffffff02dfc6050000000000080053636351ab0052afd56903000000000453ab5265f6c90d99", "006551abacacac", 0, 1299280838, "a4c0773204ab418a939e23f493bd4b3e817375d133d307609e9782f2cc38dbcf"],
                ["ca816e7802cd43d66b9374cd9bf99a8da09402d69c688d8dcc5283ace8f147e1672b757e020200000005516aabab5240fb06c95c922342279fcd88ba6cd915933e320d7becac03192e0941e0345b79223e89570300000004005151ac353ecb5d0264dfbd010000000005ac6aacababd5d70001000000000752ac53ac6a5151ec257f71", "63ac", 1, 774695685, "cc180c4f797c16a639962e7aec58ec4b209853d842010e4d090895b22e7a7863"],
                ["b42b955303942fedd7dc77bbd9040aa0de858afa100f399d63c7f167b7986d6c2377f66a7403000000066aac00525100ffffffff0577d04b64880425a3174055f94191031ad6b4ca6f34f6da9be7c3411d8b51fc000000000300526a6391e1cf0f22e45ef1c44298523b516b3e1249df153590f592fcb5c5fc432dc66f3b57cb03000000046a6aac65ffffffff0393a6c9000000000004516a65aca674ac0400000000046a525352c82c370000000000030053538e577f89", "", 1, -1237094944, "566953eb806d40a9fb684d46c1bf8c69dea86273424d562bd407b9461c8509af"],
                ["92c9fe210201e781b72554a0ed5e22507fb02434ddbaa69aff6e74ea8bad656071f1923f3f02000000056a63ac6a514470cef985ba83dcb8eee2044807bedbf0d983ae21286421506ae276142359c8c6a34d68020000000863ac63525265006aa796dd0102ca3f9d05000000000800abab52ab535353cd5c83010000000007ac00525252005322ac75ee", "5165", 0, 97879971, "6e6307cef4f3a9b386f751a6f40acebab12a0e7e17171d2989293cbec7fd45c2"],
                ["ccca1d5b01e40fe2c6b3ee24c660252134601dab785b8f55bd6201ffaf2fddc7b3e2192325030000000365535100496d4703b4b66603000000000665535253ac633013240000000000015212d2a502000000000951abac636353636a5337b82426", "0052", 0, -1691630172, "577bf2b3520b40aef44899a20d37833f1cded6b167e4d648fc5abe203e43b649"],
                ["bc1a7a3c01691e2d0c4266136f12e391422f93655c71831d90935fbda7e840e50770c61da20000000008635253abac516353ffffffff031f32aa020000000003636563786dbc0200000000003e950f00000000000563516a655184b8a1de", "51536a", 0, -1627072905, "730bc25699b46703d7718fd5f5c34c4b5f00f594a9968ddc247fa7d5175124ed"],
                ["076d209e02d904a6c40713c7225d23e7c25d4133c3c3477828f98c7d6dbd68744023dbb66b030000000753ab00536565acffffffff10975f1b8db8861ca94c8cc7c7cff086ddcd83e10b5fffd4fc8f2bdb03f9463c0100000000ffffffff029dff76010000000006526365530051a3be6004000000000000000000", "515253ac65acacac", 1, -1207502445, "66c488603b2bc53f0d22994a1f0f66fb2958203102eba30fe1d37b27a55de7a5"],
                ["690fd1f80476db1f9eebe91317f2f130a60cbc1f4feadd9d6474d438e9cb7f91e4994600af0300000004ab536a63a15ce9fa6622d0c4171d895b42bff884dc6e8a7452f827fdc68a29c3c88e6fdee364eaf50000000002ab52ffffffff022dc39d3c0956b24d7f410b1e387859e7a72955f45d6ffb1e884d77888d18fe0300000005ac6a63656afffffffff10b06bce1800f5c49153d24748fdefb0bf514c12863247d1042d56018c3e25c03000000086a63ac6365536a52ffffffff031f162f0500000000060000655265abffbcd40500000000045151ac001a9c8c05000000000652ac53656a6300000000", "ac51ab63acac", 0, -67986012, "051c0df7ac688c2c930808dabde1f50300aea115f2bb3334f4753d5169b51e46"],
                ["49ac2af00216c0307a29e83aa5de19770e6b20845de329290bd69cf0e0db7aed61ae41b39002000000035163ac8b2558ef84635bfc59635150e90b61fc753d34acfd10d97531043053e229cd720133cd95000000000463516a51ffffffff02458471040000000008abab636a51ac0065545aa80000000000096a6553516a5263ac6a00000000", "51526300ab5363", 1, 1449668540, "ddfd902bba312a06197810da96a0ddccb595f96670b28ded7dba88d8cd0469b8"],
                ["fa4d868b024b010bd5dce46576c2fb489aa60bb797dac3c72a4836f49812c5c564c258414f03000000007a9b3a585e05027bdd89edbadf3c85ac61f8c3a04c773fa746517ae600ff1a9d6b6c02fb0200000004515163abffffffff01b17d020500000000046a65520000000000", "536565ab65635363", 0, -1718953372, "96c2b32f0a00a5925db7ba72d0b5d39922f30ea0f7443b22bc1b734808513c47"],
                ["cac6382d0462375e83b67c7a86c922b569a7473bfced67f17afd96c3cd2d896cf113febf9e0300000003006a53ffffffffaa4913b7eae6821487dd3ca43a514e94dcbbf350f8cc4cafff9c1a88720711b800000000096a6a525300acac6353ffffffff184fc4109c34ea27014cc2c1536ef7ed1821951797a7141ddacdd6e429fae6ff01000000055251655200ffffffff9e7b79b4e6836e290d7b489ead931cba65d1030ccc06f20bd4ca46a40195b33c030000000008f6bc8304a09a2704000000000563655353511dbc73050000000000cf34c500000000000091f76e0000000000085200ab00005100abd07208cb", "0063656a", 2, -1488731031, "bf078519fa87b79f40abc38f1831731422722c59f88d86775535f209cb41b9b1"],
                ["1711146502c1a0b82eaa7893976fefe0fb758c3f0e560447cef6e1bde11e42de91a125f71c030000000015bd8c04703b4030496c7461482481f290c623be3e76ad23d57a955807c9e851aaaa20270300000000d04abaf20326dcb7030000000001632225350400000000075263ac00520063dddad9020000000000af23d148", "52520053510063", 0, 1852122830, "e33d5ee08c0f3c130a44d7ce29606450271b676f4a80c52ab9ffab00cecf67f8"],
                ["8d5b124d0231fbfc640c706ddb1d57bb49a18ba8ca0e1101e32c7e6e65a0d4c7971d93ea360100000008acabac0000abac65ffffffff8fe0fd7696597b845c079c3e7b87d4a44110c445a330d70342a5501955e17dd70100000004ab525363ef22e8a90346629f030000000009516a00ac63acac51657bd57b05000000000200acfd4288050000000009acab5352ab00ab636300000000", "53ac526553ab65", 0, 1253152975, "8b57a7c3170c6c02dd14ae1d392ce3d828197b20e9145c89c1cfd5de050e1562"],
                ["38146dc502c7430e92b6708e9e107b61cd38e5e773d9395e5c8ad8986e7e4c03ee1c1e1e760100000000c8962ce2ac1bb3b1285c0b9ba07f4d2e5ce87c738c42ac0548cd8cec1100e6928cd6b0b6010000000763ab636aab52527cccefbd04e5f6f8020000000006006aabacac65ab2c4a00000000000351635209a6f40100000000026aacce57dc040000000008ab5353ab516a516a00000000", "ab", 0, -1205978252, "3cb5b030e7da0b60ccce5b4a7f3793e6ca56f03e3799fe2d6c3cc22d6d841dcb"],
                ["22d81c740469695a6a83a9a4824f77ecff8804d020df23713990afce2b72591ed7de98500502000000065352526a6a6affffffff90dc85e118379b1005d7bbc7d2b8b0bab104dad7eaa49ff5bead892f17d8c3ba010000000665656300ab51ffffffff965193879e1d5628b52005d8560a35a2ba57a7f19201a4045b7cbab85133311d0200000003ac005348af21a13f9b4e0ad90ed20bf84e4740c8a9d7129632590349afc03799414b76fd6e826200000000025353ffffffff04a0d40d04000000000060702700000000000652655151516ad31f1502000000000365ac0069a1ac0500000000095100655300ab53525100000000", "51636a52ac", 0, -1644680765, "add7f5da27262f13da6a1e2cc2feafdc809bd66a67fb8ae2a6f5e6be95373b6f"],
                ["a27dcbc801e3475174a183586082e0914c314bc9d79d1570f29b54591e5e0dff07fbb45a7f0000000004ac53ab51ffffffff027347f5020000000005535351ab63d0e5c9030000000009ac65ab6a63515200ab7cd632ed", "ac63636553", 0, -686435306, "883a6ea3b2cc53fe8a803c229106366ca14d25ffbab9fef8367340f65b201da6"],
                ["b123ed2204410d4e8aaaa8cdb95234ca86dad9ff77fb4ae0fd4c06ebed36794f0215ede0040100000002ac63ffffffff3b58b81b19b90d8f402701389b238c3a84ff9ba9aeea298bbf15b41a6766d27a01000000056a6553ab00151824d401786153b819831fb15926ff1944ea7b03d884935a8bde01ed069d5fd80220310200000000ffffffffa9c9d246f1eb8b7b382a9032b55567e9a93f86c77f4e32c092aa1738f7f756c30100000002ab65ffffffff011a2b48000000000000ed44d1fb", "630051ab63", 2, -1118263883, "b5dab912bcabedff5f63f6dd395fc2cf030d83eb4dd28214baba68a45b4bfff0"],
                ["1339051503e196f730955c5a39acd6ed28dec89b4dadc3f7c79b203b344511270e5747fa9900000000045151636affffffff378c6090e08a3895cedf1d25453bbe955a274657172491fd2887ed5c9aceca7b0100000000ffffffffcf7cc3c36ddf9d4749edfa9cefed496d2f86e870deb814bfcd3b5637a5496461030000000451006300ffffffff04dcf3fa010000000008526a63005263acabb41d84040000000004abac5153800eff020000000005656a535365106c5e00000000000000000000", "abac5300", 2, 2013719928, "7fc74de39ce6ca46ca25d760d3cec7bb21fd14f7efe1c443b5aa294f2cb5f546"],
                ["0728c606014c1fd6005ccf878196ba71a54e86cc8c53d6db500c3cc0ac369a26fac6fcbc210000000005ab53ac5365ba9668290182d7870100000000066a000053655100000000", "65", 0, 1789961588, "ab6baa6da3b2bc853868d166f8996ad31d63ef981179f9104f49968fd61c8427"],
                ["a1134397034bf4067b6c81c581e2b73fb63835a08819ba24e4e92df73074bf773c94577df7000000000465525251ffffffff8b6608feaa3c1f35f49c6330a769716fa01c5c6f6e0cdc2eb10dfc99bbc21e77010000000952656aac005352655180a0bda4bc72002c2ea8262e26e03391536ec36867258cab968a6fd6ec7523b64fa1d8c001000000056a53ac6353ffffffff04dbeeed05000000000553650052abcd5d0e01000000000463abab51104b2e0500000000066aac53ac5165283ca7010000000004535252ab00000000", "ab515151516552ab", 1, -324598676, "91178482112f94d1c8e929de443e4b9c893e18682998d393ca9ca77950412586"],
                ["bcdafbae04aa18eb75855aeb1f5124f30044741351b33794254a80070940cb10552fa4fa8e0300000001acd0423fe6e3f3f88ae606f2e8cfab7a5ef87caa2a8f0401765ff9a47d718afcfb40c0099b0000000008ac6565ab53ac6aac645308009d680202d600e492b31ee0ab77c7c5883ebad5065f1ce87e4dfe6453e54023a0010000000151ffffffffb9d818b14245899e1d440152827c95268a676f14c3389fc47f5a11a7b38b1bde03000000026300ffffffff03cda22102000000000751ac535263005100a4d20400000000045200536ac8bef405000000000700ab51ab6563ac00000000", "6553516a526aab", 1, -2111409753, "5e1849e7368cf4f042718586d9bd831d61479b775bab97aba9f450042bd9876a"],
                ["ed3bb93802ddbd08cb030ef60a2247f715a0226de390c9c1a81d52e83f8674879065b5f87d0300000003ab6552ffffffff04d2c5e60a21fb6da8de20bf206db43b720e2a24ce26779bca25584c3f765d1e0200000008ab656a6aacab00ab6e946ded025a811d04000000000951abac6352ac00ab5143cfa3030000000005635200636a00000000", "5352ac650065535300", 1, -668727133, "e9995065e1fddef72a796eef5274de62012249660dc9d233a4f24e02a2979c87"],
                ["59f4629d030fa5d115c33e8d55a79ea3cba8c209821f979ed0e285299a9c72a73c5bba00150200000002636affffffffd8aca2176df3f7a96d0dc4ee3d24e6cecde1582323eec2ebef9a11f8162f17ac0000000007ab6565acab6553ffffffffeebc10af4f99c7a21cbc1d1074bd9f0ee032482a71800f44f26ee67491208e0403000000065352ac656351ffffffff0434e955040000000004ab515152caf2b305000000000365ac007b1473030000000003ab530033da970500000000060051536a5253bb08ab51", "", 2, 396340944, "0e9c47973ef2c292b2252c623f465bbb92046fe0b893eebf4e1c9e02cb01c397"],
                ["286e3eb7043902bae5173ac3b39b44c5950bc363f474386a50b98c7bdab26f98dc83449c4a020000000752ac6a00510051ffffffff4339cd6a07f5a5a2cb5815e5845da70300f5c7833788363bf7fe67595d3225520100000000fffffffff9c2dd8b06ad910365ffdee1a966f124378a2b8021065c8764f6138bb1e951380200000005ab5153ac6affffffff0370202aba7a68df85436ea7c945139513384ef391fa33d16020420b8ad40e9a000000000900ab5165526353abacffffffff020c1907000000000004abac526a1b490b040000000000df1528f7", "5353ab", 3, -1407529517, "32154c09174a9906183abf26538c39e78468344ca0848bbd0785e24a3565d932"],
                ["2e245cf80179e2e95cd1b34995c2aff49fe4519cd7cee93ad7587f7f7e8105fc2dff206cd30200000009006a63516a6553ab52350435a201d5ed2d02000000000352ab6558552c89", "00ab53", 0, -233917810, "4605ae5fd3d50f9c45d37db7118a81a9ef6eb475d2333f59df5d3e216f150d49"],
                ["33a98004029d262f951881b20a8d746c8c707ea802cd2c8b02a33b7e907c58699f97e42be80100000007ac53536552abacdee04cc01d205fd8a3687fdf265b064d42ab38046d76c736aad8865ca210824b7c622ecf02000000070065006a536a6affffffff01431c5d010000000000270d48ee", "", 1, 921554116, "ff9d7394002f3f196ea25472ea6c46f753bd879a7244795157bb7235c9322902"],
                ["aac18f2b02b144ed481557c53f2146ae523f24fcde40f3445ab0193b6b276c315dc2894d2300000000075165650000636a233526947dbffc76aec7db1e1baa6868ad4799c76e14794dcbaaec9e713a83967f6a65170200000005abac6551ab27d518be01b652a30000000000015300000000", "52ac5353", 1, 1559377136, "59fc2959bb7bb24576cc8a237961ed95bbb900679d94da6567734c4390cb6ef5"],
                ["5ab79881033555b65fe58c928883f70ce7057426fbdd5c67d7260da0fe8b1b9e6a2674cb850300000009ac516aac6aac006a6affffffffa5be9223b43c2b1a4d120b5c5b6ec0484f637952a3252181d0f8e813e76e11580200000000e4b5ceb8118cb77215bbeedc9a076a4d087bb9cd1473ea32368b71daeeeacc451ec209010000000005acac5153aced7dc34e02bc5d11030000000005ac5363006a54185803000000000552ab00636a00000000", "5100", 1, 1927062711, "e9f53d531c12cce1c50abed4ac521a372b4449b6a12f9327c80020df6bff66c0"],
                ["6c2c8fac0124b0b7d4b610c3c5b91dee32b7c927ac71abdf2d008990ca1ac40de0dfd530660300000006ababac5253656bd7eada01d847ec000000000004ac52006af4232ec8", "6a6a6a0051", 0, -340809707, "fb51eb9d7e47d32ff2086205214f90c7c139e08c257a64829ae4d2b301071c6a"],
                ["6e3880af031735a0059c0bb5180574a7dcc88e522c8b56746d130f8d45a52184045f96793e0100000008acabac6a526a6553fffffffffe05f14cdef7d12a9169ec0fd37524b5fcd3295f73f48ca35a36e671da4a2f560000000008006a526a6351ab63ffffffffdfbd869ac9e472640a84caf28bdd82e8c6797f42d03b99817a705a24fde2736600000000010090a090a503db956b04000000000952ac53ab6a536a63ab358390010000000009656a5200525153ac65353ee204000000000763530052526aaba6ad83fb", "535151ab6300", 2, 222014018, "57a34ddeb1bf36d28c7294dda0432e9228a9c9e5cc5c692db98b6ed2e218d825"],
                ["8df1cd19027db4240718dcaf70cdee33b26ea3dece49ae6917331a028c85c5a1fb7ee3e475020000000865ab6a00510063636157988bc84d8d55a8ba93cdea001b9bf9d0fa65b5db42be6084b5b1e1556f3602f65d4d0100000005ac00ab0052206c852902b2fb54030000000008ac5252536aacac5378c4a5050000000007acabac535163532784439e", "acab6a", 0, 1105620132, "edb7c74223d1f10f9b3b9c1db8064bc487321ff7bb346f287c6bc2fad83682de"],
                ["0e803682024f79337b25c98f276d412bc27e56a300aa422c42994004790cee213008ff1b8303000000080051ac65ac655165f421a331892b19a44c9f88413d057fea03c3c4a6c7de4911fe6fe79cf2e9b3b10184b1910200000005525163630096cb1c670398277204000000000253acf7d5d502000000000963536a6a636a5363ab381092020000000002ac6a911ccf32", "6565", 1, -1492094009, "f0672638a0e568a919e9d8a9cbd7c0189a3e132940beeb52f111a89dcc2daa2c"],
                ["7d71669d03022f9dd90edac323cde9e56354c6804c6b8e687e9ae699f46805aafb8bcaa636000000000253abffffffff698a5fdd3d7f2b8b000c68333e4dd58fa8045b3e2f689b889beeb3156cecdb490300000009525353abab0051acabc53f0aa821cdd69b473ec6e6cf45cf9b38996e1c8f52c27878a01ec8bb02e8cb31ad24e500000000055353ab0052ffffffff0447a23401000000000565ab53ab5133aaa0030000000006515163656563057d110300000000056a6aacac52cf13b5000000000003526a5100000000", "6a6a51", 1, -1349253507, "722efdd69a7d51d3d77bed0ac5544502da67e475ea5857cd5af6bdf640a69945"],
                ["9ff618e60136f8e6bb7eabaaac7d6e2535f5fba95854be6d2726f986eaa9537cb283c701ff02000000026a65ffffffff012d1c0905000000000865ab00ac6a516a652f9ad240", "51515253635351ac", 0, 1571304387, "659cd3203095d4a8672646add7d77831a1926fc5b66128801979939383695a79"],
                ["9fbd43ac025e1462ecd10b1a9182a8e0c542f6d1089322a41822ab94361e214ed7e1dfdd8a020000000263519d0437581538e8e0b6aea765beff5b4f3a4a202fca6e5d19b34c141078c6688f71ba5b8e0100000003ac6552ffffffff02077774050000000009655153655263acab6a0ae4e10100000000035152524c97136b", "635152ab", 0, 1969622955, "d82d4ccd9b67810f26a378ad9592eb7a30935cbbd27e859b00981aefd0a72e08"],
                ["0117c92004314b84ed228fc11e2999e657f953b6de3b233331b5f0d0cf40d5cc149b93c7b30300000005515263516a083e8af1bd540e54bf5b309d36ba80ed361d77bbf4a1805c7aa73667ad9df4f97e2da410020000000600ab6351ab524d04f2179455e794b2fcb3d214670001c885f0802e4b5e015ed13a917514a7618f5f332203000000086a536aab51000063ecf029e65a4a009a5d67796c9f1eb358b0d4bd2620c8ad7330fb98f5a802ab92d0038b1002000000036a6551a184a88804b04490000000000009ab6a5152535165526a33d1ab020000000001518e92320000000000002913df04000000000952abac6353525353ac8b19bfdf", "000051ab0000", 0, 489433059, "8eebac87e60da524bbccaf285a44043e2c9232868dda6c6271a53c153e7f3a55"],
                ["e7f5482903f98f0299e0984b361efb2fddcd9979869102281e705d3001a9d283fe9f3f3a1e02000000025365ffffffffcc5c7fe82feebad32a22715fc30bc584efc9cd9cadd57e5bc4b6a265547e676e0000000001ab579d21235bc2281e08bf5e7f8f64d3afb552839b9aa5c77cf762ba2366fffd7ebb74e49400000000055263ab63633df82cf40100982e05000000000453ac535300000000", "acacab", 2, -1362931214, "046de666545330e50d53083eb78c9336416902f9b96c77cc8d8e543da6dfc7e4"],
                ["09adb2e90175ca0e816326ae2dce7750c1b27941b16f6278023dbc294632ab97977852a09d030000000465ab006affffffff027739cf0100000000075151ab63ac65ab8a5bb601000000000653ac5151520011313cdc", "ac", 0, -76831756, "478ee06501b4965b40bdba6cbaad9b779b38555a970912bb791b86b7191c54bc"],
                ["f973867602e30f857855cd0364b5bbb894c049f44abbfd661d7ae5dbfeaafca89fac8959c20100000005ab52536a51ffffffffbeceb68a4715f99ba50e131884d8d20f4a179313691150adf0ebf29d05f8770303000000066352ab00ac63ffffffff021fddb90000000000036a656322a177000000000008526500ac5100acac84839083", "52acab53ac", 0, 1407879325, "db0329439490efc64b7104d6d009b03fbc6fac597cf54fd786fbbb5fd73b92b4"],
                ["fd22ebaa03bd588ad16795bea7d4aa7f7d48df163d75ea3afebe7017ce2f350f6a0c1cb0bb00000000086aabac5153526363ffffffff488e0bb22e26a565d77ba07178d17d8f85702630ee665ec35d152fa05af3bda10200000004515163abffffffffeb21035849e85ad84b2805e1069a91bb36c425dc9c212d9bae50a95b6bfde1200300000001ab5df262fd02b69848040000000008ab6363636a6363ace23bf2010000000007655263635253534348c1da", "006353526563516a00", 0, -1491036196, "92364ba3c7a85d4e88885b8cb9b520dd81fc29e9d2b750d0790690e9c1246673"],
                ["130b462d01dd49fac019dc4442d0fb54eaa6b1c2d1ad0197590b7df26969a67abd7f3fbb4f0100000008ac65abac53ab6563ffffffff0345f825000000000004ac53acac9d5816020000000002ababeff8e90500000000086aab006552ac6a53a892dc55", "ab0065ac530052", 0, 944483412, "1f4209fd4ce7f13d175fdd522474ae9b34776fe11a5f17a27d0796c77a2a7a9d"],
                ["f8e50c2604609be2a95f6d0f31553081f4e1a49a0a30777fe51eb1c596c1a9a92c053cf28c0300000009656a51ac5252630052fffffffff792ed0132ae2bd2f11d4a2aab9d0c4fbdf9a66d9ae2dc4108afccdc14d2b1700100000007ab6a6563ac636a7bfb2fa116122b539dd6a2ab089f88f3bc5923e5050c8262c112ff9ce0a3cd51c6e3e84f02000000066551ac5352650d5e687ddf4cc9a497087cabecf74d236aa4fc3081c3f67b6d323cba795e10e7a171b725000000000852635351ab635100ffffffff02df5409020000000008ac6a53acab5151004156990200000000045163655200000000", "ac53abac65005300", 0, -173065000, "b596f206d7eba22b7e2d1b7a4f4cf69c7c541b6c84dcc943f84e19a99a923310"],
                ["18020dd1017f149eec65b2ec23300d8df0a7dd64fc8558b36907723c03cd1ba672bbb0f51d0300000005ab65ab6a63ffffffff037cd7ae000000000009ab516a65005352ac65f1e4360400000000056353530053f118f0040000000009536363ab006500abac00000000", "63ab51acab52ac", 0, -550412404, "e19b796c14a0373674968e342f2741d8b51092a5f8409e9bff7dcd52e56fcbcb"],
                ["b04154610363fdade55ceb6942d5e5a723323863b48a0cb04fdcf56210717955763f56b08d0300000009ac526a525151635151ffffffff93a176e76151a9eabdd7af00ef2af72f9e7af5ecb0aa4d45d00618f394cdd03c030000000074d818b332ebe05dc24c44d776cf9d275c61f471cc01efce12fd5a16464157f1842c65cb00000000066a0000ac6352d3c4134f01d8a1c0030000000005520000005200000000", "5200656a656351", 2, -9757957, "6e3e5ba77f760b6b5b5557b13043f1262418f3dd2ce7f0298b012811fc8ad5bc"],
                ["9794b3ce033df7b1e32db62d2f0906b589eacdacf5743963dc2255b6b9a6cba211fadd0d41020000000600ab00650065ffffffffaae00687a6a4131152bbcaafedfaed461c86754b0bde39e2bef720e6d1860a0302000000070065516aac6552ffffffff50e4ef784d6230df7486e972e8918d919f005025bc2d9aacba130f58bed7056703000000075265ab52656a52ffffffff02c6f1a9000000000006005251006363cf450c040000000008abab63510053abac00000000", "ac0063ababab515353", 1, 2063905082, "fad092fc98f17c2c20e10ba9a8eb44cc2bcc964b006f4da45cb9ceb249c69698"],
                ["94533db7015e70e8df715066efa69dbb9c3a42ff733367c18c22ff070392f988f3b93920820000000006535363636300ce4dac3e03169af80300000000080065ac6a53ac65ac39c050020000000006abacab6aacac708a02050000000005ac5251520000000000", "6553", 0, -360458507, "5418cf059b5f15774836edd93571e0eed3855ba67b2b08c99dccab69dc87d3e9"],
                ["c8597ada04f59836f06c224a2640b79f3a8a7b41ef3efa2602592ddda38e7597da6c639fee0300000009005251635351acabacffffffff4c518f347ee694884b9d4072c9e916b1a1f0a7fc74a1c90c63fdf8e5a185b6ae02000000007113af55afb41af7518ea6146786c7c726641c68c8829a52925e8d4afd07d8945f68e7230300000008ab00ab65ab650063ffffffffc28e46d7598312c420e11dfaae12add68b4d85adb182ae5b28f8340185394b63000000000165ffffffff04dbabb7010000000000ee2f6000000000000852ab6500ab6a51acb62a27000000000009ac53515300ac006a6345fb7505000000000752516a0051636a00000000", "", 3, 15199787, "0d66003aff5bf78cf492ecbc8fd40c92891acd58d0a271be9062e035897f317e"],
                ["1a28c4f702c8efaad96d879b38ec65c5283b5c084b819ad7db1c086e85e32446c7818dc7a90300000008656351536a525165fa78cef86c982f1aac9c5eb8b707aee8366f74574c8f42ef240599c955ef4401cf578be30200000002ab518893292204c430eb0100000000016503138a0300000000040053abac60e0eb010000000005525200ab63567c2d030000000004abab52006cf81e85", "ab51525152", 1, 2118315905, "4e4c9a781f626b59b1d3ad8f2c488eb6dee8bb19b9bc138bf0dc33e7799210d4"],
                ["c6c7a87003f772bcae9f3a0ac5e499000b68703e1804b9ddc3e73099663564d53ddc4e1c6e01000000076a536a6aac63636e3102122f4c30056ef8711a6bf11f641ddfa6984c25ac38c3b3e286e74e839198a80a34010000000165867195cd425821dfa2f279cb1390029834c06f018b1e6af73823c867bf3a0524d1d6923b0300000005acab53ab65ffffffff02fa4c49010000000008ab656a0052650053e001100400000000008836d972", "ac526351acab", 1, 978122815, "a869c18a0edf563d6e5eddd5d5ae8686f41d07f394f95c9feb8b7e52761531ca"],
                ["0ea580ac04c9495ab6af3b8d59108bb4194fcb9af90b3511c83f7bb046d87aedbf8423218e02000000085152acac006363ab9063d7dc25704e0caa5edde1c6f2dd137ded379ff597e055b2977b9c559b07a7134fcef2000000000200aca89e50181f86e9854ae3b453f239e2847cf67300fff802707c8e3867ae421df69274449402000000056365abababffffffff47a4760c881a4d7e51c69b69977707bd2fb3bcdc300f0efc61f5840e1ac72cee0000000000ffffffff0460179a020000000004ab53ab52a5250c0500000000096565acac6365ab52ab6c281e02000000000952635100ac006563654e55070400000000046552526500000000", "ab526563acac53ab", 2, 1426964167, "b1c50d58b753e8f6c7513752158e9802cf0a729ebe432b99acc0fe5d9b4e9980"],
                ["c33028b301d5093e1e8397270d75a0b009b2a6509a01861061ab022ca122a6ba935b8513320200000000ffffffff013bcf5a0500000000015200000000", "", 0, -513413204, "6b1459536f51482f5dbf42d7e561896557461e1e3b6bf67871e2b51faae2832c"],
                ["43b2727901a7dd06dd2abf690a1ccedc0b0739cb551200796669d9a25f24f71d8d101379f50300000000ffffffff0418e031040000000000863d770000000000085352ac526563ac5174929e040000000004ac65ac00ec31ac0100000000066a51ababab5300000000", "65", 0, -492874289, "154ff7a9f0875edcfb9f8657a0b98dd9600fabee3c43eb88af37cf99286d516c"],
                ["4763ed4401c3e6ab204bed280528e84d5288f9cac5fb8a2e7bd699c7b98d4df4ac0c40e55303000000066a6aacab5165ffffffff015b57f80400000000046a63535100000000", "ac51abab53", 0, -592611747, "849033a2321b5755e56ef4527ae6f51e30e3bca50149d5707368479723d744f8"],
                ["d24f647b02f71708a880e6819a1dc929c1a50b16447e158f8ff62f9ccd644e0ca3c592593702000000050053536a00ffffffff67868cd5414b6ca792030b18d649de5450a456407242b296d936bcf3db79e07b02000000005af6319c016022f50100000000036a516300000000", "6aab526353516a6a", 0, 1350782301, "8556fe52d1d0782361dc28baaf8774b13f3ce5ed486ae0f124b665111e08e3e3"],
                ["fe6ddf3a02657e42a7496ef170b4a8caf245b925b91c7840fd28e4a22c03cb459cb498b8d603000000065263656a650071ce6bf8d905106f9f1faf6488164f3decac65bf3c5afe1dcee20e6bc3cb6d052561985a030000000163295b117601343dbb0000000000026563dba521df", "", 1, -1696179931, "d9684685c99ce48f398fb467a91a1a59629a850c429046fb3071f1fa9a5fe816"],
                ["c61523ef0129bb3952533cbf22ed797fa2088f307837dd0be1849f20decf709cf98c6f032f03000000026563c0f1d378044338310400000000066363516a5165a14fcb0400000000095163536a6a00ab53657271d60200000000001d953f0500000000010000000000", "53516353005153", 0, 1141615707, "7e975a72db5adaa3c48d525d9c28ac11cf116d0f8b16ce08f735ad75a80aec66"],
                ["ba3dac6c0182562b0a26d475fe1e36315f0913b6869bdad0ecf21f1339a5fcbccd32056c840200000000ffffffff04300351050000000000220ed405000000000851abac636565ac53dbbd19020000000007636363ac6a52acbb005a0500000000016abd0c78a8", "63006a635151005352", 0, 1359658828, "47bc8ab070273e1f4a0789c37b45569a6e16f3f3092d1ce94dddc3c34a28f9f4"],
                ["ac27e7f5025fc877d1d99f7fc18dd4cadbafa50e34e1676748cc89c202f93abf36ed46362101000000036300abffffffff958cd5381962b765e14d87fc9524d751e4752dd66471f973ed38b9d562e525620100000003006500ffffffff02b67120050000000004ac51516adc330c0300000000015200000000", "656352", 1, 15049991, "f3374253d64ac264055bdbcc32e27426416bd595b7c7915936c70f839e504010"],
                ["edb30140029182b80c8c3255b888f7c7f061c4174d1db45879dca98c9aab8c8fed647a6ffc03000000086a53510052ab6300ffffffff82f65f261db62d517362c886c429c8fbbea250bcaad93356be6f86ba573e9d930100000000ffffffff04daaf150400000000016a86d1300100000000096a6353535252ac5165d4ddaf000000000002abab5f1c6201000000000000000000", "ab6a6a00ac", 0, -2058017816, "8d7794703dad18e2e40d83f3e65269834bb293e2d2b8525932d6921884b8f368"],
                ["7e50207303146d1f7ad62843ae8017737a698498d4b9118c7a89bb02e8370307fa4fada41d000000000753006300005152b7afefc85674b1104ba33ef2bf37c6ed26316badbc0b4aa6cb8b00722da4f82ff3555a6c020000000900ac656363ac51ac52ffffffff93fab89973bd322c5d7ad7e2b929315453e5f7ada3072a36d8e33ca8bebee6e0020000000300acab930da52b04384b04000000000004650052ac435e380200000000076a6a515263ab6aa9494705000000000600ab6a525252af8ba90100000000096565acab526353536a279b17ad", "acac005263536aac63", 1, -34754133, "4e6357da0057fb7ff79da2cc0f20c5df27ff8b2f8af4c1709e6530459f7972b0"],
                ["c05764f40244fb4ebe4c54f2c5298c7c798aa90e62c29709acca0b4c2c6ec08430b26167440100000008acab6a6565005253ffffffffc02c2418f398318e7f34a3cf669d034eef2111ea95b9f0978b01493293293a870100000000e563e2e00238ee8d040000000002acab03fb060200000000076500ac656a516aa37f5534", "52ab6a0065", 1, -2033176648, "83deef4a698b62a79d4877dd9afebc3011a5275dbe06e89567e9ef84e8a4ee19"],
                ["5a59e0b9040654a3596d6dab8146462363cd6549898c26e2476b1f6ae42915f73fd9aedfda00000000036363abffffffff9ac9e9ca90be0187be2214251ff08ba118e6bf5e2fd1ba55229d24e50a510d53010000000165ffffffff41d42d799ac4104644969937522873c0834cc2fcdab7cdbecd84d213c0e96fd60000000000ffffffffd838db2c1a4f30e2eaa7876ef778470f8729fcf258ad228b388df2488709f8410300000000fdf2ace002ceb6d903000000000265654c1310040000000003ac00657e91c0ec", "536a63ac", 0, 82144555, "98ccde2dc14d14f5d8b1eeea5364bd18fc84560fec2fcea8de4d88b49c00695e"],
                ["156ebc8202065d0b114984ee98c097600c75c859bfee13af75dc93f57c313a877efb09f230010000000463536a51ffffffff81114e8a697be3ead948b43b5005770dd87ffb1d5ccd4089fa6c8b33d3029e9c03000000066a5251656351ffffffff01a87f140000000000050000ac51ac00000000", "00", 0, -362221092, "a903c84d8c5e71134d1ab6dc1e21ac307c4c1a32c90c90f556f257b8a0ec1bf5"],
                ["15e37793023c7cbf46e073428908fce0331e49550f2a42b92468827852693f0532a01c29f70200000007005353636351acffffffff38426d9cec036f00eb56ec1dcd193647e56a7577278417b8a86a78ac53199bc403000000056353006a53ffffffff04a25ce103000000000900ab5365656a526a63c8eff7030000000004526353537ab6db0200000000016a11a3fa02000000000651acacab526500000000", "53ac6aab6a6551", 0, 1117532791, "83c68b3c5a89260ce16ce8b4dbf02e1f573c532d9a72f5ea57ab419fa2630214"],
                ["f7a09f10027250fc1b70398fb5c6bffd2be9718d3da727e841a73596fdd63810c9e4520a6a010000000963ac516a636a65acac1d2e2c57ab28d311edc4f858c1663972eebc3bbc93ed774801227fda65020a7ec1965f780200000005ac5252516a8299fddc01dcbf7200000000000463ac6551960fda03", "65acab51", 1, 2017321737, "9c5fa02abfd34d0f9dec32bf3edb1089fca70016debdb41f4f54affcb13a2a2a"],
                ["6d97a9a5029220e04f4ccc342d8394c751282c328bf1c132167fc05551d4ca4da4795f6d4e02000000076a0052ab525165ffffffff9516a205e555fa2a16b73e6db6c223a9e759a7e09c9a149a8f376c0a7233fa1b0100000007acab51ab63ac6affffffff04868aed04000000000652ac65ac536a396edf01000000000044386c0000000000076aab5363655200894d48010000000001ab8ebefc23", "6351526aac51", 1, 1943666485, "f0bd4ca8e97203b9b4e86bc24bdc8a1a726db5e99b91000a14519dc83fc55c29"],
                ["8e3fddfb028d9e566dfdda251cd874cd3ce72e9dde837f95343e90bd2a93fe21c5daeb5eed01000000045151525140517dc818181f1e7564b8b1013fd68a2f9a56bd89469686367a0e72c06be435cf99db750000000003635251ffffffff01c051780300000000096552ababac6a65acab099766eb", "5163ab6a52ababab51", 1, 1296295812, "5509eba029cc11d7dd2808b8c9eb47a19022b8d8b7778893459bbc19ab7ea820"],
                ["a603f37b02a35e5f25aae73d0adc0b4b479e68a734cf722723fd4e0267a26644c36faefdab0200000000ffffffff43374ad26838bf733f8302585b0f9c22e5b8179888030de9bdda180160d770650200000001004c7309ce01379099040000000005526552536500000000", "abababab005153", 0, 1409936559, "4ca73da4fcd5f1b10da07998706ffe16408aa5dff7cec40b52081a6514e3827e"],
                ["9eeedaa8034471a3a0e3165620d1743237986f060c4434f095c226114dcb4b4ec78274729f03000000086a5365510052ac6afb505af3736e347e3f299a58b1b968fce0d78f7457f4eab69240cbc40872fd61b5bf8b120200000002ac52df8247cf979b95a4c97ecb8edf26b3833f967020cd2fb25146a70e60f82c9ee4b14e88b103000000008459e2fa0125cbcd05000000000000000000", "52ab5352006353516a", 0, -1832576682, "fb018ae54206fdd20c83ae5873ec82b8e320a27ed0d0662db09cda8a071f9852"],
                ["05921d7c048cf26f76c1219d0237c226454c2a713c18bf152acc83c8b0647a94b13477c07f0300000003ac526afffffffff2f494453afa0cabffd1ba0a626c56f90681087a5c1bd81d6adeb89184b27b7402000000036a6352ffffffff0ad10e2d3ce355481d1b215030820da411d3f571c3f15e8daf22fe15342fed04000000000095f29f7b93ff814a9836f54dc6852ec414e9c4e16a506636715f569151559100ccfec1d100000000055263656a53ffffffff04f4ffef010000000008ac6a6aabacabab6a0e6689040000000006ab536a5352abe364d005000000000965536363655251ab53807e00010000000004526aab63f18003e3", "6363ac51", 3, -375891099, "001b0b176f0451dfe2d9787b42097ceb62c70d324e925ead4c58b09eebdf7f67"],
                ["b9b44d9f04b9f15e787d7704e6797d51bc46382190c36d8845ec68dfd63ee64cf7a467b21e00000000096aac00530052ab636aba1bcb110a80c5cbe073f12c739e3b20836aa217a4507648d133a8eedd3f02cb55c132b203000000076a000063526352b1c288e3a9ff1f2da603f230b32ef7c0d402bdcf652545e2322ac01d725d75f5024048ad0100000000ffffffffffd882d963be559569c94febc0ef241801d09dc69527c9490210f098ed8203c700000000056a006300ab9109298d01719d9a0300000000066a52ab006365d7894c5b", "ac6351650063636a", 3, -622355349, "ac87b1b93a6baab6b2c6624f10e8ebf6849b0378ef9660a3329073e8f5553c8d"],
                ["ff60473b02574f46d3e49814c484081d1adb9b15367ba8487291fc6714fd6e3383d5b335f001000000026a6ae0b82da3dc77e5030db23d77b58c3c20fa0b70aa7d341a0f95f3f72912165d751afd57230300000008ac536563516a6363ffffffff04f86c0200000000000553acab636ab13111000000000003510065f0d3f305000000000951ab516a65516aabab730a3a010000000002515200000000", "ac6a", 1, 1895032314, "0767e09bba8cd66d55915677a1c781acd5054f530d5cf6de2d34320d6c467d80"],
                ["f218026204f4f4fc3d3bd0eada07c57b88570d544a0436ae9f8b753792c0c239810bb30fbc0200000002536affffffff8a468928d6ec4cc10aa0f73047697970e99fa64ae8a3b4dca7551deb0b639149010000000851ab520052650051ffffffffa98dc5df357289c9f6873d0f5afcb5b030d629e8f23aa082cf06ec9a95f3b0cf0000000000ffffffffea2c2850c5107705fd380d6f29b03f533482fd036db88739122aac9eff04e0aa010000000365536a03bd37db034ac4c4020000000007515152655200ac33b27705000000000151efb71e0000000000007b65425b", "515151", 3, -1772252043, "de35c84a58f2458c33f564b9e58bc57c3e028d629f961ad1b3c10ee020166e5a"],
                ["48e7d42103b260b27577b70530d1ac2fed2551e9dd607cbcf66dca34bb8c03862cf8f5fd5401000000075151526aacab00ffffffff1e3d3b841552f7c6a83ee379d9d66636836673ce0b0eda95af8f2d2523c91813030000000665acac006365ffffffff388b3c386cd8c9ef67c83f3eaddc79f1ff910342602c9152ffe8003bce51b28b0100000008636363006a636a52ffffffff04b8f67703000000000852005353ac6552520cef720200000000085151ab6352ab00ab5096d6030000000005516a005100662582020000000001ac6c137280", "6a65", 1, 1513618429, "e2fa3e1976aed82c0987ab30d4542da2cb1cffc2f73be13480132da8c8558d5c"],
                ["91ebc4cf01bc1e068d958d72ee6e954b196f1d85b3faf75a521b88a78021c543a06e056279000000000265ab7c12df0503832121030000000000cc41a6010000000005ab5263516540a951050000000006ab63ab65acac00000000", "526a0065636a6a6aac", 0, -614046478, "7de4ba875b2e584a7b658818c112e51ee5e86226f5a80e5f6b15528c86400573"],
                ["3cd4474201be7a6c25403bf00ca62e2aa8f8f4f700154e1bb4d18c66f7bb7f9b975649f0dc0100000006535151535153ffffffff01febbeb000000000006005151006aac00000000", "", 0, -1674687131, "6b77ca70cc452cc89acb83b69857cda98efbfc221688fe816ef4cb4faf152f86"],
                ["92fc95f00307a6b3e2572e228011b9c9ed41e58ddbaefe3b139343dbfb3b34182e9fcdc3f50200000002acab847bf1935fde8bcfe41c7dd99683289292770e7f163ad09deff0e0665ed473cd2b56b0f40300000006516551ab6351294dab312dd87b9327ce2e95eb44b712cfae0e50fda15b07816c8282e8365b643390eaab01000000026aacffffffff016e0b6b040000000001ac00000000", "650065acac005300", 2, -1885164012, "bd7d26bb3a98fc8c90c972500618bf894cb1b4fe37bf5481ff60eef439d3b970"],
                ["4db591ab018adcef5f4f3f2060e41f7829ce3a07ea41d681e8cb70a0e37685561e4767ac3b0000000005000052acabd280e63601ae6ef20000000000036a636326c908f7", "ac6a51526300630052", 0, 862877446, "355ccaf30697c9c5b966e619a554d3323d7494c3ea280a9b0dfb73f953f5c1cb"],
                ["503fd5ef029e1beb7b242d10032ac2768f9a1aca0b0faffe51cec24770664ec707ef7ede4f01000000045253ac53375e350cc77741b8e96eb1ce2d3ca91858c052e5f5830a0193200ae2a45b413dda31541f0000000003516553ffffffff0175a5ba0500000000015200000000", "6aab65510053ab65", 1, 1603081205, "353ca9619ccb0210ae18b24d0e57efa7abf8e58fa6f7102738e51e8e72c9f0c4"],
                ["c80abebd042cfec3f5c1958ee6970d2b4586e0abec8305e1d99eb9ee69ecc6c2cbd76374380000000007ac53006300ac510acee933b44817db79320df8094af039fd82111c7726da3b33269d3820123694d849ee5001000000056a65ab526562699bea8530dc916f5d61f0babea709dac578774e8a4dcd9c640ec3aceb6cb2443f24f302000000020063ea780e9e57d1e4245c1e5df19b4582f1bf704049c5654f426d783069bcc039f2d8fa659f030000000851ab53635200006a8d00de0b03654e8500000000000463ab635178ebbb0400000000055100636aab239f1d030000000006ab006300536500000000", "6565ac515100", 3, 1460851377, "b35bb1b72d02fab866ed6bbbea9726ab32d968d33a776686df3ac16aa445871e"],
                ["0337b2d5043eb6949a76d6632b8bb393efc7fe26130d7409ef248576708e2d7f9d0ced9d3102000000075352636a5163007034384dfa200f52160690fea6ce6c82a475c0ef1caf5c9e5a39f8f9ddc1c8297a5aa0eb02000000026a51ffffffff38e536298799631550f793357795d432fb2d4231f4effa183c4e2f61a816bcf0030000000463ac5300706f1cd3454344e521fde05b59b96e875c8295294da5d81d6cc7efcfe8128f150aa54d6503000000008f4a98c704c1561600000000000072cfa6000000000000e43def01000000000100cf31cc0500000000066365526a6500cbaa8e2e", "", 3, 2029506437, "7615b4a7b3be865633a31e346bc3db0bcc410502c8358a65b8127089d81b01f8"],
                ["59f6cffd034733f4616a20fe19ea6aaf6abddb30b408a3a6bd86cd343ab6fe90dc58300cc90200000000ffffffffc835430a04c3882066abe7deeb0fa1fdaef035d3233460c67d9eabdb05e95e5a02000000080065ac535353ab00ffffffff4b9a043e89ad1b4a129c8777b0e8d87a014a0ab6a3d03e131c27337bbdcb43b402000000066a5100abac6ad9e9bf62014bb118010000000001526cbe484f", "ab526352ab65", 0, 2103515652, "4f2ccf981598639bec57f885b4c3d8ea8db445ea6e61cfd45789c69374862e5e"],
                ["cbc79b10020b15d605680a24ee11d8098ad94ae5203cb6b0589e432832e20c27b72a926af20300000006ab65516a53acbb854f3146e55c508ece25fa3d99dbfde641a58ed88c051a8a51f3dacdffb1afb827814b02000000026352c43e6ef30302410a020000000000ff4bd90100000000065100ab63000008aa8e0400000000095265526565ac5365abc52c8a77", "53526aac0051", 0, 202662340, "984efe0d8d12e43827b9e4b27e97b3777ece930fd1f589d616c6f9b71dab710e"],
                ["7c07419202fa756d29288c57b5c2b83f3c847a807f4a9a651a3f6cd6c46034ae0aa3a7446b0200000004ab6a6365ffffffff9da83cf4219bb96c76f2d77d5df31c1411a421171d9b59ec02e5c1218f29935403000000008c13879002f8b1ac0400000000086a63536a636553653c584f02000000000000000000", "abac53ab656363", 1, -1038419525, "4a74f365a161bc6c9bddd249cbd70f5dadbe3de70ef4bd745dcb6ee1cd299fbd"],
                ["351cbb57021346e076d2a2889d491e9bfa28c54388c91b46ee8695874ad9aa576f1241874d0200000008ab6563525300516affffffffe13e61b8880b8cd52be4a59e00f9723a4722ea58013ec579f5b3693b9e115b1100000000096363abac5252635351ffffffff027fee02040000000008ab6a5200ab006a65b85f130200000000086a52630053ab52ab00000000", "ab6aab65", 1, 586415826, "08bbb746a596991ab7f53a76e19acad087f19cf3e1db54054aab403c43682d09"],
                ["a8252ea903f1e8ff953adb16c1d1455a5036222c6ea98207fc21818f0ece2e1fac310f9a0100000000095163ac635363ac0000be6619e9fffcde50a0413078821283ce3340b3993ad00b59950bae7a9f931a9b0a3a035f010000000463005300b8b0583fbd6049a1715e7adacf770162811989f2be20af33f5f60f26eba653dc26b024a00000000006525351636552ffffffff046d2acc030000000002636a9a2d430500000000080065005165ab53abecf63204000000000052b9ed050000000008acacac53ab65656500000000", "65ab53635253636a51", 2, 1442639059, "8ca11838775822f9a5beee57bdb352f4ee548f122de4a5ca61c21b01a1d50325"],
                ["2f1a425c0471a5239068c4f38f9df135b1d24bf52d730d4461144b97ea637504495aec360801000000055300515365c71801dd1f49f376dd134a9f523e0b4ae611a4bb122d8b26de66d95203f181d09037974300000000025152ffffffff9bdcea7bc72b6e5262e242c94851e3a5bf8f314b3e5de0e389fc9e5b3eadac030000000009525265655151005153ffffffffdbb53ce99b5a2320a4e6e2d13b01e88ed885a0957d222e508e9ec8e4f83496cb0200000007635200abac63ac04c96237020cc5490100000000080000516a51ac6553074a360200000000025152225520ca", "6551ab65ac65516a", 1, -489869549, "9bc5bb772c553831fb40abe466074e59a469154679c7dee042b8ea3001c20393"],
                ["ef3acfd4024defb48def411b8f8ba2dc408dc9ee97a4e8bde4d6cb8e10280f29c98a6e8e9103000000035100513d5389e3d67e075469dfd9f204a7d16175653a149bd7851619610d7ca6eece85a516b2df0300000005516aac6552ca678bdf02f477f003000000000057e45b0300000000055252525252af35c20a", "5165ac53ab", 1, -1900839569, "78eb6b24365ac1edc386aa4ffd15772f601059581c8776c34f92f8a7763c9ccf"],
                ["ff4468dc0108475fc8d4959a9562879ce4ab4867a419664bf6e065f17ae25043e6016c70480100000000ffffffff02133c6f0400000000000bd0a8020000000004006a520035afa4f6", "51ac65ab", 0, -537664660, "f6da59b9deac63e83728850ac791de61f5dfcaeed384ebcbb20e44afcd8c8910"],
                ["4e8594d803b1d0a26911a2bcdd46d7cbc987b7095a763885b1a97ca9cbb747d32c5ab9aa91030000000353ac53a0cc4b215e07f1d648b6eeb5cdbe9fa32b07400aa773b9696f582cebfd9930ade067b2b200000000060065abab6500fc99833216b8e27a02defd9be47fafae4e4a97f52a9d2a210d08148d2a4e5d02730bcd460100000004516351ac37ce3ae1033baa55040000000006006a636a63acc63c990400000000025265eb1919030000000005656a6a516a00000000", "", 1, -75217178, "04c5ee48514cd033b82a28e336c4d051074f477ef2675ce0ce4bafe565ee9049"],
                ["a88830a7023f13ed19ab14fd757358eb6af10d6520f9a54923a6d613ac4f2c11e249cda8aa030000000851630065abababacffffffff8f5fe0bc04a33504c4b47e3991d25118947a0261a9fa520356731eeabd561dd3020000000363ababffffffff038404bd010000000008ab5153516aab6a63d33a5601000000000263004642dc020000000009655152acac636352004be6f3af", "5253536565006aab6a", 0, 1174417836, "2e42ead953c9f4f81b72c27557e6dc7d48c37ff2f5c46c1dbe9778fb0d79f5b2"],
                ["44e1a2b4010762af23d2027864c784e34ef322b6e24c70308a28c8f2157d90d17b99cd94a401000000085163656565006300ffffffff0198233d020000000002000000000000", "52525153656365", 0, 1119696980, "d9096de94d70c6337da6202e6e588166f31bff5d51bb5adc9468594559d65695"],
                ["44ca65b901259245abd50a745037b17eb51d9ce1f41aa7056b4888285f48c6f26cb97b7a25020000000552636363abffffffff047820350400000000040053acab14f3e603000000000652635100ab630ce66c03000000000001bdc704000000000765650065ac51ac3e886381", "51", 0, -263340864, "ed5622ac642d11f90e68c0feea6a2fe36d880ecae6b8c0d89c4ea4b3d162bd90"],
                ["cfa147d2017fe84122122b4dda2f0d6318e59e60a7207a2d00737b5d89694d480a2c26324b0000000006006351526552ffffffff0456b5b804000000000800516aab525363ab166633000000000004655363ab254c0e02000000000952ab6a6a00ab525151097c1b020000000009656a52ac6300530065ad0d6e50", "6a535165ac6a536500", 0, -574683184, "f926d4036eac7f019a2b0b65356c4ee2fe50e089dd7a70f1843a9f7bc6997b35"],
                ["91c5d5f6022fea6f230cc4ae446ce040d8313071c5ac1749c82982cc1988c94cb1738aa48503000000016a19e204f30cb45dd29e68ff4ae160da037e5fc93538e21a11b92d9dd51cf0b5efacba4dd70000000005656a6aac51ffffffff03db126905000000000953006a53ab6563636a36a273030000000006656a52656552b03ede00000000000352516500000000", "530052526a00", 1, 1437328441, "255c125b60ee85f4718b2972174c83588ee214958c3627f51f13b5fb56c8c317"],
                ["03f20dc202c886907b607e278731ebc5d7373c348c8c66cac167560f19b341b782dfb634cb03000000076a51ac6aab63abea3e8de7adb9f599c9caba95aa3fa852e947fc88ed97ee50e0a0ec0d14d164f44c0115c10100000004ab5153516fdd679e0414edbd000000000005ac636a53512021f2040000000007006a0051536a52c73db2050000000005525265ac5369046e000000000003ab006a1ef7bd1e", "52656a", 0, 1360223035, "5a0a05e32ce4cd0558aabd5d79cd5fcbffa95c07137506e875a9afcba4bef5a2"],
                ["d9611140036881b61e01627078512bc3378386e1d4761f959d480fdb9d9710bebddba2079d020000000763536aab5153ab819271b41e228f5b04daa1d4e72c8e1955230accd790640b81783cfc165116a9f535a74c000000000163ffffffffa2e7bb9a28e810624c251ff5ba6b0f07a356ac082048cf9f39ec036bba3d431a02000000076a000000ac65acffffffff01678a820000000000085363515153ac635100000000", "535353", 2, -82213851, "52b9e0778206af68998cbc4ebdaad5a9469e04d0a0a6cef251abfdbb74e2f031"],
                ["98b3a0bf034233afdcf0df9d46ac65be84ef839e58ee9fa59f32daaa7d684b6bdac30081c60200000007636351acabababffffffffc71cf82ded4d1593e5825618dc1d5752ae30560ecfaa07f192731d68ea768d0f0100000006650052636563f3a2888deb5ddd161430177ce298242c1a86844619bc60ca2590d98243b5385bc52a5b8f00000000095365acacab520052ac50d4722801c3b8a60300000000035165517e563b65", "51", 1, -168940690, "b6b684e2d2ecec8a8dce4ed3fc1147f8b2e45732444222aa8f52d860c2a27a9d"],
                ["97be4f7702dc20b087a1fdd533c7de762a3f2867a8f439bddf0dcec9a374dfd0276f9c55cc0300000000cdfb1dbe6582499569127bda6ca4aaff02c132dc73e15dcd91d73da77e92a32a13d1a0ba0200000002ab51ffffffff048cfbe202000000000900516351515363ac535128ce0100000000076aac5365ab6aabc84e8302000000000863536a53ab6a6552f051230500000000066aac535153510848d813", "ac51", 0, 229541474, "e5da9a416ea883be1f8b8b2d178463633f19de3fa82ae25d44ffb531e35bdbc8"],
                ["085b6e04040b5bff81e29b646f0ed4a45e05890a8d32780c49d09643e69cdccb5bd81357670100000001abffffffffa5c981fe758307648e783217e3b4349e31a557602225e237f62b636ec26df1a80300000004650052ab4792e1da2930cc90822a8d2a0a91ea343317bce5356b6aa8aae6c3956076aa33a5351a9c0300000004abac5265e27ddbcd472a2f13325cc6be40049d53f3e266ac082172f17f6df817db1936d9ff48c02b000000000152ffffffff021aa7670500000000085353635163ab51ac14d584000000000001aca4d136cc", "6a525300536352536a", 0, -1398925877, "41ecca1e8152ec55074f4c39f8f2a7204dda48e9ec1e7f99d5e7e4044d159d43"],
                ["eec32fff03c6a18b12cd7b60b7bdc2dd74a08977e53fdd756000af221228fe736bd9c42d870100000007005353ac515265ffffffff037929791a188e9980e8b9cc154ad1b0d05fb322932501698195ab5b219488fc02000000070063510065ab6a0bfc176aa7e84f771ea3d45a6b9c24887ceea715a0ff10ede63db8f089e97d927075b4f1000000000551abab63abffffffff02eb933c000000000000262c420000000000036563632549c2b6", "6352", 2, 1480445874, "ff8a4016dfdd918f53a45d3a1f62b12c407cd147d68ca5c92b7520e12c353ff5"],
                ["98ea7eac0313d9fb03573fb2b8e718180c70ce647bebcf49b97a8403837a2556cb8c9377f30000000004ac53ac65ffffffff8caac77a5e52f0d8213ef6ce998bedbb50cfdf108954771031c0e0cd2a78423900000000010066e99a44937ebb37015be3693761078ad5c73aa73ec623ac7300b45375cc8eef36087eb80000000007515352acac5100ffffffff0114a51b02000000000000000000", "6aacab", 0, 243527074, "bad77967f98941af4dd52a8517d5ad1e32307c0d511e15461e86465e1b8b5273"],
                ["3ab70f4604e8fc7f9de395ec3e4c3de0d560212e84a63f8d75333b604237aa52a10da17196000000000763526a6553ac63a25de6fd66563d71471716fe59087be0dde98e969e2b359282cf11f82f14b00f1c0ac70f02000000050052516aacdffed6bb6889a13e46956f4b8af20752f10185838fd4654e3191bf49579c961f5597c36c0100000005ac636363abc3a1785bae5b8a1b4be5d0cbfadc240b4f7acaa7dfed6a66e852835df5eb9ac3c553766801000000036a65630733b7530218569602000000000952006a6a6a51acab52777f06030000000007ac0063530052abc08267c9", "000000536aac0000", 1, 1919096509, "df1c87cf3ba70e754d19618a39fdbd2970def0c1bfc4576260cba5f025b87532"],
                ["bdb6b4d704af0b7234ced671c04ba57421aba7ead0a117d925d7ebd6ca078ec6e7b93eea6600000000026565ffffffff3270f5ad8f46495d69b9d71d4ab0238cbf86cc4908927fbb70a71fa3043108e6010000000700516a65655152ffffffff6085a0fdc03ae8567d0562c584e8bfe13a1bd1094c518690ebcb2b7c6ce5f04502000000095251530052536a53aba576a37f2c516aad9911f687fe83d0ae7983686b6269b4dd54701cb5ce9ec91f0e6828390300000000ffffffff04cc76cc020000000002656a01ffb702000000000253ab534610040000000009acab006565516a00521f55f5040000000000389dfee9", "6a525165", 0, 1336204763, "71c294523c48fd7747eebefbf3ca06e25db7b36bff6d95b41c522fecb264a919"],
                ["54258edd017d22b274fbf0317555aaf11318affef5a5f0ae45a43d9ca4aa652c6e85f8a040010000000953ac65ab5251656500ffffffff03321d450000000000085265526a51526a529ede8b030000000003635151ce6065020000000001534c56ec1b", "acac", 0, 2094130012, "110d90fea9470dfe6c5048f45c3af5e8cc0cb77dd58fd13d338268e1c24b1ccc"],
                ["ce0d322e04f0ffc7774218b251530a7b64ebefca55c90db3d0624c0ff4b3f03f918e8cf6f60300000003656500ffffffff9cce943872da8d8af29022d0b6321af5fefc004a281d07b598b95f6dcc07b1830200000007abab515351acab8d926410e69d76b7e584aad1470a97b14b9c879c8b43f9a9238e52a2c2fefc2001c56af8010000000400ab5253cd2cd1fe192ce3a93b5478af82fa250c27064df82ba416dfb0debf4f0eb307a746b6928901000000096500abacac6a0063514214524502947efc0200000000035251652c40340100000000096a6aab52000052656a5231c54c", "51", 2, -2090320538, "0322ca570446869ec7ec6ad66d9838cff95405002d474c0d3c17708c7ee039c6"],
                ["47ac54940313430712ebb32004679d3a512242c2b33d549bf5bbc8420ec1fd0850ed50eb6d0300000009536aac6a65acacab51ffffffffb843e44266ce2462f92e6bff54316661048c8c17ecb092cb493b39bfca9117850000000001519ab348c05e74ebc3f67423724a3371dd99e3bceb4f098f8860148f48ad70000313c4c223000000000653006565656512c2d8dc033f3c97010000000002636aa993aa010000000006526365ab526ab7cf560300000000076a0065ac6a526500000000", "005352535300ab6a", 2, 59531991, "8b5b3d00d9c658f062fe6c5298e54b1fe4ed3a3eab2a87af4f3119edc47b1691"],
                ["233cd90b043916fc41eb870c64543f0111fb31f3c486dc72457689dea58f75c16ae59e9eb2000000000500536a6a6affffffff9ae30de76be7cd57fb81220fce78d74a13b2dbcad4d023f3cadb3c9a0e45a3ce000000000965ac6353ac5165515130834512dfb293f87cb1879d8d1b20ebad9d7d3d5c3e399a291ce86a3b4d30e4e32368a9020000000453005165ffffffff26d84ae93eb58c81158c9b3c3cbc24a84614d731094f38d0eea8686dec02824d0300000005636a65abacf02c784001a0bd5d03000000000900655351ab65ac516a416ef503", "", 1, -295106477, "b79f31c289e95d9dadec48ebf88e27c1d920661e50d090e422957f90ff94cb6e"],
                ["9200e26b03ff36bc4bf908143de5f97d4d02358db642bd5a8541e6ff709c420d1482d471b70000000008abab65536a636553ffffffff61ba6d15f5453b5079fb494af4c48de713a0c3e7f6454d7450074a2a80cb6d880300000007ac6a00ab5165515dfb7574fbce822892c2acb5d978188b1d65f969e4fe874b08db4c791d176113272a5cc10100000000ffffffff0420958d000000000009ac63516a0063516353dd885505000000000465ac00007b79e901000000000066d8bf010000000005525252006a00000000", "ac5152", 0, 2089531339, "89ec7fab7cfe7d8d7d96956613c49dc48bf295269cfb4ea44f7333d88c170e62"],
                ["45f335ba01ce2073a8b0273884eb5b48f56df474fc3dff310d9706a8ac7202cf5ac188272103000000025363ffffffff049d859502000000000365ab6a8e98b1030000000002ac51f3a80603000000000752535151ac00000306e30300000000020051b58b2b3a", "", 0, 1899564574, "78e01310a228f645c23a2ad0acbb8d91cedff4ecdf7ca997662c6031eb702b11"],
                ["d8f652a6043b4faeada05e14b81756cd6920cfcf332e97f4086961d49232ad6ffb6bc6c097000000000453526563ffffffff1ea4d60e5e91193fbbc1a476c8785a79a4c11ec5e5d6c9950c668ceacfe07a15020000000352ab51fffffffffe029a374595c4edd382875a8dd3f20b9820abb3e93f877b622598d11d0b09e503000000095351000052ac515152ffffffff9d65fea491b979699ceb13caf2479cd42a354bd674ded3925e760758e85a756803000000046365acabffffffff0169001d00000000000651636a65656300000000", "ab0063630000ac", 3, 1050965951, "4cc85cbc2863ee7dbce15490d8ca2c5ded61998257b9eeaff968fe38e9f009ae"],
                ["718662be026e1dcf672869ac658fd0c87d6835cfbb34bd854c44e577d5708a7faecda96e260300000004526a636a489493073353b678549adc7640281b9cbcb225037f84007c57e55b874366bb7b0fa03bdc00000000095165ababac65ac00008ab7f2a802eaa53d000000000007acac516aac526ae92f380100000000056aac00536500000000", "ab00", 1, 43296088, "2d642ceee910abff0af2116af75b2e117ffb7469b2f19ad8fef08f558416d8f7"],
                ["94083c840288d40a6983faca876d452f7c52a07de9268ad892e70a81e150d602a773c175ad03000000007ec3637d7e1103e2e7e0c61896cbbf8d7e205b2ecc93dd0d6d7527d39cdbf6d335789f660300000000ffffffff019e1f7b03000000000800ac0051acac0053539cb363", "", 1, -183614058, "a17b66d6bb427f42653d08207a22b02353dd19ccf2c7de6a9a3a2bdb7c49c9e7"],
                ["30e0d4d20493d0cd0e640b757c9c47a823120e012b3b64c9c1890f9a087ae4f2001ca22a61010000000152f8f05468303b8fcfaad1fb60534a08fe90daa79bff51675472528ebe1438b6f60e7f60c10100000009526aab6551ac510053ffffffffaaab73957ea2133e32329795221ed44548a0d3a54d1cf9c96827e7cffd1706df0200000009ab00526a005265526affffffffd19a6fe54352015bf170119742821696f64083b5f14fb5c7d1b5a721a3d7786801000000085265abababac53abffffffff020f39bd030000000004ab6aac52049f6c050000000004ab52516aba5b4c60", "6a6365516a6a655253", 0, -624256405, "8e221a6c4bf81ca0d8a0464562674dcd14a76a32a4b7baf99450dd9195d411e6"],
                ["f9c69d940276ec00f65f9fe08120fc89385d7350388508fd80f4a6ba2b5d4597a9e21c884f010000000663ab63ababab15473ae6d82c744c07fc876ecd53bd0f3018b2dbedad77d757d5bdf3811b23d294e8c0170000000001abafababe00157ede2050000000006ac6a5263635300000000", "ab53", 1, 606547088, "714d8b14699835b26b2f94c58b6ea4c53da3f7adf0c62ea9966b1e1758272c47"],
                ["5c0ac112032d6885b7a9071d3c5f493aa16c610a4a57228b2491258c38de8302014276e8be030000000300ab6a17468315215262ad5c7393bb5e0c5a6429fd1911f78f6f72dafbbbb78f3149a5073e24740300000003ac5100ffffffff33c7a14a062bdea1be3c9c8e973f54ade53fe4a69dcb5ab019df5f3345050be00100000008ac63655163526aab428defc0033ec36203000000000765516365536a00ae55b2000000000002ab53f4c0080400000000095265516a536563536a00000000", "6a005151006a", 2, 272749594, "91082410630337a5d89ff19145097090f25d4a20bdd657b4b953927b2f62c73b"],
                ["e3683329026720010b08d4bec0faa244f159ae10aa582252dd0f3f80046a4e145207d54d31000000000852acac52656aacac3aaf2a5017438ad6adfa3f9d05f53ebed9ceb1b10d809d507bcf75e0604254a8259fc29c020000000653526552ab51f926e52c04b44918030000000000f7679c0100000000090000525152005365539e3f48050000000009516500ab635363ab008396c905000000000253650591024f", "6a6365", 0, 908746924, "458aec3b5089a585b6bad9f99fd37a2b443dc5a2eefac2b7e8c5b06705efc9db"],
                ["48c4afb204204209e1df6805f0697edaa42c0450bbbd767941fe125b9bc40614d63d757e2203000000066a5363005152dc8b6a605a6d1088e631af3c94b8164e36e61445e2c60130292d81dabd30d15f54b355a802000000036a6353ffffffff1d05dcec4f3dedcfd02c042ce5d230587ee92cb22b52b1e59863f3717df2362f0300000005536552ac52ffffffffd4d71c4f0a7d53ba47bb0289ca79b1e33d4c569c1e951dd611fc9c9c1ca8bc6c030000000865536a65ab51abacffffffff042f9aa905000000000753655153656351ab93d8010000000002655337440e0300000000005d4c690000000000015278587acb", "ab006565526a51", 0, 1502064227, "bbed77ff0f808aa8abd946ba9e7ec1ddb003a969fa223dee0af779643cb841a9"],
                ["00b20fd104dd59705b84d67441019fa26c4c3dec5fd3b50eca1aa549e750ef9ddb774dcabe000000000651ac656aac65ffffffff52d4246f2db568fc9eea143e4d260c698a319f0d0670f84c9c83341204fde48b0200000000ffffffffb8aeabb85d3bcbc67b132f1fd815b451ea12dcf7fc169c1bc2e2cf433eb6777a03000000086a51ac6aab6563acd510d209f413da2cf036a31b0def1e4dcd8115abf2e511afbcccb5ddf41d9702f28c52900100000006ac52ab6a0065ffffffff039c8276000000000008ab53655200656a52401561010000000003acab0082b7160100000000035100ab00000000", "535265", 1, -947367579, "3212c6d6dd8d9d3b2ac959dec11f4638ccde9be6ed5d36955769294e23343da0"],
                ["455131860220abbaa72015519090a666faf137a0febce7edd49da1eada41feab1505a0028b02000000036365ab453ead4225724eb69beb590f2ec56a7693a608871e0ab0c34f5e96157f90e0a96148f3c502000000085251ab51535163acffffffff022d1249040000000009abac00acac6565630088b310040000000000e3920e59", "5152ab6a52ac5152", 0, 294375737, "c40fd7dfa72321ac79516502500478d09a35cc22cc264d652c7d18b14400b739"],
                ["624d28cb02c8747915e9af2b13c79b417eb34d2fa2a73547897770ace08c6dd9de528848d3030000000651ab63abab533c69d3f9b75b6ef8ed2df50c2210fd0bf4e889c42477d58682f711cbaece1a626194bb85030000000765acab53ac5353ffffffff018cc280040000000009abacabac52636352ac6859409e", "ac51ac", 1, 1005144875, "919144aada50db8675b7f9a6849c9d263b86450570293a03c245bd1e3095e292"],
                ["8f28471d02f7d41b2e70e9b4c804f2d90d23fb24d53426fa746bcdcfffea864925bdeabe3e0200000001acffffffff76d1d35d04db0e64d65810c808fe40168f8d1f2143902a1cc551034fd193be0e0000000001acffffffff048a5565000000000005005151516afafb610400000000045263ac53648bb30500000000086363516a6a5165513245de01000000000000000000", "6a0053510053", 1, -1525137460, "305fc8ff5dc04ebd9b6448b03c9a3d945a11567206c8d5214666b30ec6d0d6cc"],
                ["10ec50d7046b8b40e4222a3c6449490ebe41513aad2eca7848284a08f3069f3352c2a9954f0000000009526aac656352acac53ffffffff0d979f236155aa972472d43ee6f8ce22a2d052c740f10b59211454ff22cb7fd00200000007acacacab63ab53ffffffffbbf97ebde8969b35725b2e240092a986a2cbfd58de48c4475fe077bdd493a20c010000000663ab5365ababffffffff4600722d33b8dba300d3ad037bcfc6038b1db8abfe8008a15a1de2da2264007302000000035351ac6dbdafaf020d0ccf04000000000663ab6a51ab6ae06e5e0200000000036aabab00000000", "", 0, -1658960232, "2420dd722e229eccafae8508e7b8d75c6920bfdb3b5bac7cb8e23419480637c2"],
                ["fef98b7101bf99277b08a6eff17d08f3fcb862e20e13138a77d66fba55d54f26304143e5360100000006515365abab00ffffffff04265965030000000004655252ace2c775010000000001002b23b4040000000007516a5153ab53ac456a7a00000000000753ab525251acacba521291", "526aacacab00abab53", 0, -1614097109, "4370d05c07e231d6515c7e454a4e401000b99329d22ed7def323976fa1d2eeb5"],
                ["34a2b8830253661b373b519546552a2c3bff7414ea0060df183b1052683d78d8f54e842442000000000152ffffffffd961a8e34cf374151058dfcddc86509b33832bc57267c63489f69ff01199697c0300000002abacba856cfb01b17c2f050000000008515365ac53ab000000000000", "5263ab656a", 1, -2104480987, "2f9993e0a84a6ca560d6d1cc2b63ffe7fd71236d9cfe7d809491cef62bbfad84"],
                ["43559290038f32fda86580dd8a4bc4422db88dd22a626b8bd4f10f1c9dd325c8dc49bf479f01000000026351ffffffff401339530e1ed3ffe996578a17c3ec9d6fccb0723dd63e7b3f39e2c44b976b7b0300000006ab6a65656a51ffffffff6fb9ba041c96b886482009f56c09c22e7b0d33091f2ac5418d05708951816ce7000000000551ac525100ffffffff020921e40500000000035365533986f40500000000016a00000000", "52ac51", 0, 1769771809, "02040283ef2291d8e1f79bb71bdabe7c1546c40d7ed615c375643000a8b9600d"],
                ["6878a6bd02e7e1c8082d5e3ee1b746cfebfac9e8b97e61caa9e0759d8a8ecb3743e36a30de0100000002ab532a911b0f12b73e0071f5d50b6bdaf783f4b9a6ce90ec0cad9eecca27d5abae188241ddec0200000001651c7758d803f7457b0500000000036551515f4e90000000000001007022080200000000035365acc86b6946", "6351ab", 0, -1929374995, "f24be499c58295f3a07f5f1c6e5084496ae160450bd61fdb2934e615289448f1"],
                ["35b6fc06047ebad04783a5167ab5fc9878a00c4eb5e7d70ef297c33d5abd5137a2dea9912402000000036aacacffffffff21dc291763419a584bdb3ed4f6f8c60b218aaa5b99784e4ba8acfec04993e50c03000000046a00ac6affffffff69e04d77e4b662a82db71a68dd72ef0af48ca5bebdcb40f5edf0caf591bb41020200000000b5db78a16d93f5f24d7d932f93a29bb4b784febd0cbb1943f90216dc80bba15a0567684b000000000853ab52ab5100006a1be2208a02f6bdc103000000000265ab8550ea04000000000365636a00000000", "", 0, -1114114836, "1c8655969b241e717b841526f87e6bd68b2329905ba3fc9e9f72526c0b3ea20c"],
                ["bebb90c302bf91fd4501d33555a5fc5f2e1be281d9b7743680979b65c3c919108cc2f517510100000003abab00ffffffff969c30053f1276550532d0aa33cfe80ca63758cd215b740448a9c08a84826f3303000000056565ab5153ffffffff04bf6f2a04000000000565ab5265ab903e760100000000026a6a7103fa020000000006526553525365b05b2c000000000006ab000000535300000000", "51510053ab63635153", 1, 1081291172, "94338cd47a4639be30a71e21a7103cee4c99ef7297e0edd56aaf57a068b004de"],
                ["af48319f031b4eeb4319714a285f44244f283cbff30dcb9275b06f2348ccd0d7f015b54f8500000000066363ac65ac6affffffff2560a9817ebbc738ad01d0c9b9cf657b8f9179b1a7f073eb0b67517409d108180200000005ac6365ab52ffffffff0bdd67cd4ecae96249a2e2a96db1490ee645f042fd9d5579de945e22b799f4d003000000086552ab515153ab00cf187c8202e51abf0300000000066552006a00abadf37d000000000004ac6a535100000000", "63ab65", 1, -1855554446, "60caf46a7625f303c04706cec515a44b68ec319ee92273acb566cca4f66861c1"],
                ["f35befbc03faf8c25cc4bc0b92f6239f477e663b44b83065c9cb7cf231243032cf367ce3130000000005ab65526a517c4c334149a9c9edc39e29276a4b3ffbbab337de7908ea6f88af331228bd90086a6900ba020000000151279d19950d2fe81979b72ce3a33c6d82ebb92f9a2e164b6471ac857f3bbd3c0ea213b542010000000953ab51635363520065052657c20300a9ba04000000000452636a6a0516ea020000000008535253656365ababcfdd3f01000000000865ac516aac00530000000000", "", 2, -99793521, "c834a5485e68dc13edb6c79948784712122440d7fa5bbaa5cd2fc3d4dac8185d"],
                ["d3da18520216601acf885414538ce2fb4d910997eeb91582cac42eb6982c9381589587794f0300000000fffffffff1b1c9880356852e10cf41c02e928748dd8fae2e988be4e1c4cb32d0bfaea6f7000000000465ab6aabffffffff02fb0d69050000000002ababeda8580500000000085163526565ac52522b913c95", "ac", 1, -1247973017, "99b32b5679d91e0f9cdd6737afeb07459806e5acd7630c6a3b9ab5d550d0c003"],
                ["8218eb740229c695c252e3630fc6257c42624f974bc856b7af8208df643a6c520ef681bfd00000000002510066f30f270a09b2b420e274c14d07430008e7886ec621ba45665057120afce58befca96010300000004525153ab84c380a9015d96100000000000076a5300acac526500000000", "ac005263", 0, -1855679695, "5071f8acf96aea41c7518bd1b5b6bbe16258b529df0c03f9e374b83c66b742c6"],
                ["1123e7010240310013c74e5def60d8e14dd67aedff5a57d07a24abc84d933483431b8cf8ea0300000003530051fc6775ff1a23c627a2e605dd2560e84e27f4208300071e90f4589e762ad9c9fe8d0da95e020000000465655200ffffffff04251598030000000004ab65ab639d28d90400000000096563636aacac525153474df801000000000851525165ac51006a75e23b040000000000e5bd3a4a", "6363636565", 0, -467124448, "9cb0dd04e9fe287b112e94a1647590d27e8b164ca13c4fe70c610fd13f82c2fd"],
                ["fd92fe1003083c5179f97e77bf7d71975788138147adbdb283306802e261c0aee080fa22630200000000860c643ba9a1816b9badf36077b4554d11720e284e395a1121bc45279e148b2064c65e49020000000651ab6a53636a2c713088d20f4bc4001264d972cce05b9fe004dc33376ad24d0d013e417b91a5f1b6734e000000000100ffffffff02e3064c0500000000066552006a5165b86e8705000000000665ab65ab53522052eadb", "00ab53525265", 0, 776203277, "47207b48777727532f62e09afcd4104ea6687e723c7657c30504fa2081331cc8"],
                ["d1b6a703038f14d41fcc5cc45455faa135a5322be4bf0f5cbcd526578fc270a236cacb853f0200000001abffffffff135aeff902fa38f202ccf5bd34437ff89c9dc57a028b62447a0a38579383e8ef0000000000ffffffffadf398d2c818d0b90bc474f540c3618a4a643482eeab73d36101987e2ec0335900000000004bd3323504e69fc10000000000055151535251790ada02000000000563ab6aab521337a704000000000963ac63abacac52656a1e9862010000000007656500ac51ab6a8f4ee672", "ab5251656565ac63", 2, 82008394, "b8f3d255549909c07588ecba10a02e55a2d6f2206d831af9da1a7dae64cfbc8b"],
                ["81dadaa7011556683db3fe95262f4fdb20391b7e75b7ffcee51b176af64d83c06f85545d620200000005ab5151ab52ffffffff044805ef0300000000065353516352639702c802000000000900516351515252ab5270db08040000000009ac516aab526553abac4aabc90500000000096365ab0052636a525100000000", "6565ab6a5152", 0, -2126294159, "ad01ec9d6dbae325ec3a8e1fd98e2d03b1188378210efef093dd8b0b0ef3f19d"],
                ["3b937e05032b8895d2f4945cb7e3679be2fbd15311e2414f4184706dbfc0558cf7de7b4d000000000001638b91a12668a3c3ce349788c961c26aa893c862f1e630f18d80e7843686b6e1e6fc396310000000000852635353ab65ac51eeb09dd1c9605391258ee6f74b9ae17b5e8c2ef010dc721c5433dcdc6e93a1593e3b6d1700000000085365ac6553526351ffffffff0308b18e04000000000253acb6dd00040000000008536aac5153ac516ab0a88201000000000500ac006500804e3ff2", "", 0, 416167343, "595a3c02254564634e8085283ec4ea7c23808da97ce9c5da7aecd7b553e7fd7f"],
                ["a48f27ca047997470da74c8ee086ddad82f36d9c22e790bd6f8603ee6e27ad4d3174ea875403000000095153ac636aab6aacabffffffffefc936294e468d2c9a99e09909ba599978a8c0891ad47dc00ba424761627cef202000000056a51630053ffffffff304cae7ed2d3dbb4f2fbd679da442aed06221ffda9aee460a28ceec5a9399f4e0200000000f5bddf82c9c25fc29c5729274c1ff0b43934303e5f595ce86316fc66ad263b96ca46ab8d0100000003536500d7cf226b0146b00c04000000000200ac5c2014ce", "515100636563", 0, 1991799059, "9c051a7092fe17fa62b1720bc2c4cb2ffc1527d9fb0b006d2e142bb8fe07bf3c"],
                ["180cd53101c5074cf0b7f089d139e837fe49932791f73fa2342bd823c6df6a2f72fe6dba1303000000076a6a63ac53acabffffffff03853bc1020000000007ac526a6a6a6a003c4a8903000000000453515163a0fbbd030000000005ab656a5253253d64cf", "ac65", 0, -1548453970, "4d8efb3b99b9064d2f6be33b194a903ffabb9d0e7baa97a48fcec038072aac06"],
                ["c21ec8b60376c47e057f2c71caa90269888d0ffd5c46a471649144a920d0b409e56f190b700000000008acac6a526a536365ffffffff5d315d9da8bf643a9ba11299450b1f87272e6030fdb0c8adc04e6c1bfc87de9a0000000000ea43a9a142e5830c96b0ce827663af36b23b0277244658f8f606e95384574b91750b8e940000000007516a63ac0063acffffffff023c61be0400000000055165ab5263313cc8020000000006006a53526551ed8c3d56", "6a", 1, 1160627414, "a638cc17fd91f4b1e77877e8d82448c84b2a4e100df1373f779de7ad32695112"],
                ["128cd90f04b66a4cbc78bf48748f6eec0f08d5193ee8d0a6f2e8d3e5f138ed12c2c87d01a301000000085200ab6aac00ab00ffffffff09fc88bb1851e3dfb3d30179c38e15aeb1b39929c7c74f6acd071994ed4806490300000000e7fc5ea12ec56f56c0d758ecf4bb88aa95f3b08176b336db3b9bec2f6e27336dce28adbe030000000400530051fffffffffd6ff1adcf1fbe0d883451ee46904f1b7e8820243d395559b2d4ee8190a6e891000000000080fb1ae702f85b400000000000035200ab8d9651010000000006ab6a52536aab00000000", "ab", 1, 1667598199, "c10ccc9db8a92d7d4b133a2980782dab9d9d1d633d0dde9f9612ada57771fd89"],
                ["da9695a403493d3511c10e1fe1286f954db0366b7667c91ef18ae4578056c1bf752114ac5901000000035351519788d91dd1f9c62dc005d80ea54eb13f7131ca5aace3d5d29f9b58ccc5fbc9a27e779950010000000453ac6a00ffffffffe2556ff29ebe83eb42a32c7a8d93bc598043578f491b5935805a33608538845a030000000252ab65d21b3b018f26c4030000000006acab51535352e1cbcb10", "006565ab52", 2, -1550927794, "0ca673a1ee66f9625ceb9ab278ebef772c113c188112b02824570c17fdf48194"],
                ["b240517501334021240427adb0b413433641555424f6d24647211e3e6bfbb22a8045cbda2f000000000071bac8630112717802000000000000000000", "6a5165abac52656551", 0, 1790414254, "2c8be597620d95abd88f9c1cf4967c1ae3ca2309f3afec8928058c9598660e9e"],
                ["96bac43903044a199b4b3efeeec5d196ee23fb05495541fa2cd6fb6405a9432d1723363660010000000151ffffffffe6ce2b66ce1488918a3e880bebb0e750123f007c7bcbac8fcd67ce75cb6fbae80300000000ffffffff9c0955aa07f506455834895c0c56be5a095398f47c62a3d431fe125b161d666a0200000005520000abac7ffdbc540216f2f004000000000165a26dce010000000001ab00000000", "5151ab656a656a6a63", 0, -707123065, "26b22e18d5d9081fde9631594a4f7c49069ed2e429f3d08caf9d834f685ccab2"],
                ["b8fd394001ed255f49ad491fecc990b7f38688e9c837ccbc7714ddbbf5404f42524e68c18f0000000007ab6353535363ab081e15ee02706f7d050000000008515200535351526364c7ec040000000005636a53acac9206cbe1", "655352ac", 0, -1251578838, "8e0697d8cd8a9ccea837fd798cc6c5ed29f6fbd1892ee9bcb6c944772778af19"],
                ["e42a76740264677829e30ed610864160c7f97232c16528fe5610fc08814b21c34eefcea69d010000000653006a6a0052ffffffff647046cf44f217d040e6a8ff3f295312ab4dd5a0df231c66968ad1c6d8f4428000000000025352ffffffff0199a7f900000000000000000000", "655263006a005163", 1, 1122505713, "7cda43f1ff9191c646c56a4e29b1a8c6cb3f7b331da6883ef2f0480a515d0861"],
                ["0f034f32027a8e094119443aa9cfe11737c6d7dda9a52b839bc073dcc0235b847b28e0fab60200000006ac53ac536a63eee63447dfdad80476994b68706e916df1bd9d7cb4f3a4f6b14369de84564bea2e8688bd030000000565636a65acf8434663020b35fe01000000000800abab655163acabb3d6a103000000000353acab345eeda0", "526a51ac63ab51", 1, 66020215, "4435e62ff6531ac73529aac9cf878a7219e0b6e6cac79af8487c5355d1ad6d43"],
                ["a2dfa4690214c1ab25331815a5128f143219de51a47abdc7ce2d367e683eeb93960a31af9f010000000363636affffffff8be0628abb1861b078fcc19c236bc4cc726fa49068b88ad170adb2a97862e7460200000004ac655363ffffffff0441f11103000000000153dbab0c000000000009ab53ac5365526aab63abbb95050000000004ab52516a29a029040000000003ac526a00000000", "6a52ac63", 1, -1302210567, "913060c7454e6c80f5ba3835454b54db2188e37dc4ce72a16b37d11a430b3d23"],
                ["9dbc591f04521670af83fb3bb591c5d4da99206f5d38e020289f7db95414390dddbbeb56680100000004ac5100acffffffffb6a40b5e29d5e459f8e72d39f800089529f0889006cad3d734011991da8ef09d0100000009526a5100acab536a515fc427436df97cc51dc8497642ffc868857ee245314d28b356bd70adba671bd6071301fc0000000000ffffffff487efde2f620566a9b017b2e6e6d42525e4070f73a602f85c6dfd58304518db30000000005516353006a8d8090180244904a0200000000046a65656ab1e9c203000000000451ab63aba06a5449", "", 0, -1414953913, "bae189eb3d64aedbc28a6c28f6c0ccbd58472caaf0cf45a5aabae3e031dd1fea"],
                ["1345fb2c04bb21a35ae33a3f9f295bece34650308a9d8984a989dfe4c977790b0c21ff9a7f0000000006ac52ac6a0053ffffffff7baee9e8717d81d375a43b691e91579be53875350dfe23ba0058ea950029fcb7020000000753ab53ab63ab52ffffffff684b6b3828dfb4c8a92043b49b8cb15dd3a7c98b978da1d314dce5b9570dadd202000000086353ab6a5200ac63d1a8647bf667ceb2eae7ec75569ca249fbfd5d1b582acfbd7e1fcf5886121fca699c011d0100000003ac006affffffff049b1eb00300000000001e46dc0100000000080065ab6a6a630065ca95b40300000000030051520c8499010000000006ab6aac526a6500000000", "53526aac636300", 2, 1809978100, "cfeaa36790bc398783d4ca45e6354e1ea52ee74e005df7f9ebd10a680e9607bf"],
                ["7d75dc8f011e5f9f7313ba6aedef8dbe10d0a471aca88bbfc0c4a448ce424a2c5580cda1560300000003ab5152ffffffff01997f8e0200000000096552ac6a65656563530d93bbcc", "00656a6563", 0, 1414485913, "ec91eda1149f75bffb97612569a78855498c5d5386d473752a2c81454f297fa7"],
                ["1459179504b69f01c066e8ade5e124c748ae5652566b34ed673eea38568c483a5a4c4836ca0100000008ac5352006563656affffffff5d4e037880ab1975ce95ea378d2874dcd49d5e01e1cdbfae3343a01f383fa35800000000095251ac52ac6aac6500ffffffff7de3ae7d97373b7f2aeb4c55137b5e947b2d5fb325e892530cb589bc4f92abd503000000086563ac53ab520052ffffffffb4db36a32d6e543ef49f4bafde46053cb85b2a6c4f0e19fa0860d9083901a1190300000003ab51531bbcfe5504a6dbda040000000008536a5365abac6500d660c80300000000096565abab6a53536a6a54e84e010000000003acac52df2ccf0500000000025351220c857e", "", 2, 1879181631, "3aad18a209fab8db44954eb55fd3cc7689b5ec9c77373a4d5f4dae8f7ae58d14"],
                ["d98b777f04b1b3f4de16b07a05c31d79965579d0edda05600c118908d7cf642c9cd670093f020000000953005351ac65ab5363a268caad6733b7d1718008997f249e1375eb3ab9fe68ab0fe170d8e745ea24f54ce67f9b00000000066500516a5151ffffffff7ef8040dfcc86a0651f5907e8bfd1017c940f51cf8d57e3d3fe78d57e40b1e610200000003535263ffffffff39846cfed4babc098ff465256ba3820c30d710581316afcb67cd31c623b703360300000001acffffffff03d405120100000000056300006a5201a73d050000000004ab636a6a294c8c000000000006ac65536553ac00000000", "63525351abac", 1, 2018694761, "86970af23c89b72a4f9d6281e46b9ef5220816bed71ebf1ae20df53f38fe16ff"],
                ["cabb1b06045a895e6dcfc0c1e971e94130c46feace286759f69a16d298c8b0f6fd0afef8f20300000004ac006352ffffffffa299f5edac903072bfb7d29b663c1dd1345c2a33546a508ba5cf17aab911234602000000056a65515365ffffffff89a20dc2ee0524b361231092a070ace03343b162e7162479c96b757739c8394a0300000002abab92ec524daf73fabee63f95c1b79fa8b84e92d0e8bac57295e1d0adc55dc7af5534ebea410200000001534d70e79b04674f6f00000000000600abacab53517d60cc0200000000035265ab96c51d040000000004ac6300ac62a787050000000008006a516563ab63639e2e7ff7", "6551ac6351ac", 3, 1942663262, "d0c4a780e4e0bc22e2f231e23f01c9d536b09f6e5be51c123d218e906ec518be"],
                ["8b96d7a30132f6005b5bd33ea82aa325e2bcb441f46f63b5fca159ac7094499f380f6b7e2e00000000076aacabac6300acffffffff0158056700000000000465005100c319e6d0", "52006a", 0, -1100733473, "fb4bd26a91b5cf225dd3f170eb09bad0eac314bc1e74503cc2a3f376833f183e"],
                ["112191b7013cfbe18a175eaf09af7a43cbac2c396f3695bbe050e1e5f4250603056d60910e02000000001c8a5bba03738a22010000000005525352656a77a149010000000002510003b52302000000000351ac52722be8e6", "65ac6565", 0, -1847972737, "8e795aeef18f510d117dfa2b9f4a2bd2e2847a343205276cedd2ba14548fd63f"],
                ["ce6e1a9e04b4c746318424705ea69517e5e0343357d131ad55d071562d0b6ebfedafd6cb840100000003656553ffffffff67bd2fa78e2f52d9f8900c58b84c27ef9d7679f67a0a6f78645ce61b883fb8de000000000100d699a56b9861d99be2838e8504884af4d30b909b1911639dd0c5ad47c557a0773155d4d303000000046a5151abffffffff9fdb84b77c326921a8266854f7bbd5a71305b54385e747fe41af8a397e78b7fa010000000863acac6a51ab00ac0d2e9b9d049b8173010000000007ac53526a650063ba9b7e010000000008526a00525263acac0ab3fd030000000000ea8a0303000000000200aca61a97b9", "", 1, -1276952681, "b6ed4a3721be3c3c7305a5128c9d418efa58e419580cec0d83f133a93e3a22c5"],
                ["a7721d94021652d90c79aaf5022d98219337d50f836382403ed313adb1116ba507ac28b0b0010000000551ac6300ab89e6d64a7aa81fb9595368f04d1b36d7020e7adf5807535c80d015f994cce29554fe869b01000000065353ab636500ffffffff024944c90100000000046300635369df9f01000000000000000000", "656a536551ab", 0, -1740151687, "935892c6f02948f3b08bcd463b6acb769b02c1912be4450126768b055e8f183a"],
                ["2f7353dd02e395b0a4d16da0f7472db618857cd3de5b9e2789232952a9b154d249102245fd030000000151617fd88f103280b85b0a198198e438e7cab1a4c92ba58409709997cc7a65a619eb9eec3c0200000003636aabffffffff0397481c0200000000045300636a0dc97803000000000009d389030000000003ac6a53134007bb", "0000536552526a", 0, -1912746174, "30c4cd4bd6b291f7e9489cc4b4440a083f93a7664ea1f93e77a9597dab8ded9c"],
                ["7d95473604fd5267d0e1bb8c9b8be06d7e83ff18ad597e7a568a0aa033fa5b4e1e2b6f1007020000000465006a6affffffffaee008503bfc5708bd557c7e78d2eab4878216a9f19daa87555f175490c40aaf000000000263abffffffffabd74f0cff6e7ceb9acc2ee25e65af1abcebb50c08306e6c78fa8171c37613dd010000000552acacababffffffff54a3069393f7930fa1b331cdff0cb945ec21c11d4605d8eedba1d3e094c6ae1f01000000026300ffffffff0182edeb050000000009526353ab5153530065a247e8cd", "51516aab00", 2, -426210430, "2707ca714af09494bb4cf0794abe33c6cba5f29891d619e76070269d1fa8e690"],
                ["221d4718023d9ca9fe1af178dbfce02b2b369bf823ea3f43f00891b7fef98e215c06b94fdd000000000951005153ab000051acffffffffb1c7ad1c64b7441bf5e70cd0f6eb4ec96821d67fc4997d9e6dfdceadecd36dde01000000070051536a635153ffffffff04e883cd00000000000851ab536553ab0052bbb2f70400000000002f1b2e03000000000165259fcb00000000000010dbde99", "ab", 1, 665721280, "4abce77432a86dfe608e7c1646c18b5253a373392ff962e288e3ab96bba1ba1d"],
                ["6f66c0b3013e6ae6aabae9382a4326df31c981eac169b6bc4f746edaa7fc1f8c796ef4e374000000000665ab6aabac6affffffff0191c8d6030000000002525300000000", "6a5352516a635352ab", 0, -1299629906, "48411efeb133c6b7fec4e7bdbe613f827093cb06ea0dbcc2ffcfde3a9ac4356c"],
                ["89e7928c04363cb520eff4465251fd8e41550cbd0d2cdf18c456a0be3d634382abcfd4a2130200000006ac516a6a656355042a796061ed72db52ae47d1607b1ceef6ca6aea3b7eea48e7e02429f382b378c4e51901000000085351ab6352ab5252ffffffff53631cbda79b40183000d6ede011c778f70147dc6fa1aed3395d4ce9f7a8e69701000000096a6553ab52516a52abad0de418d80afe059aab5da73237e0beb60af4ac490c3394c12d66665d1bac13bdf29aa8000000000153f2b59ab6027a33eb040000000007005351ac5100ac88b941030000000003ab0052e1e8a143", "63656a", 0, 1258533326, "b575a04b0bb56e38bbf26e1a396a76b99fb09db01527651673a073a75f0a7a34"],
                ["ca356e2004bea08ec2dd2df203dc275765dc3f6073f55c46513a588a7abcc4cbde2ff011c7020000000553525100003aefec4860ef5d6c1c6be93e13bd2d2a40c6fb7361694136a7620b020ecbaca9413bcd2a030000000965ac00536352535100ace4289e00e97caaea741f2b89c1143060011a1f93090dc230bee3f05e34fbd8d8b6c399010000000365526affffffff48fc444238bda7a757cb6a98cb89fb44338829d3e24e46a60a36d4e24ba05d9002000000026a53ffffffff03d70b440200000000056a6a526aac853c97010000000002515335552202000000000351635300000000", "0052", 3, -528192467, "fc93cc056c70d5e033933d730965f36ad81ef64f1762e57f0bc5506c5b507e24"],
                ["82d4fa65017958d53e562fac073df233ab154bd0cf6e5a18f57f4badea8200b217975e31030200000004636aab51ac0891a204227cc9050000000006635200655365bfef8802000000000865650051635252acfc2d09050000000006ab65ac51516380195e030000000007ac52525352510063d50572", "53", 0, -713567171, "e095003ca82af89738c1863f0f5488ec56a96fb81ea7df334f9344fcb1d0cf40"],
                ["75f6949503e0e47dd70426ef32002d6cdb564a45abedc1575425a18a8828bf385fa8e808e600000000036aabab82f9fd14e9647d7a1b5284e6c55169c8bd228a7ea335987cef0195841e83da45ec28aa2e0300000002516350dc6fe239d150efdb1b51aa288fe85f9b9f741c72956c11d9dcd176889963d699abd63f0000000001ab429a63f502777d20010000000007abac52ac516a53d081d9020000000003acac630c3cc3a8", "535152516551510000", 1, 973814968, "c6ec1b7cb5c16a1bfd8a3790db227d2acc836300534564252b57bd66acf95092"],
                ["24f24cd90132b2162f938f1c22d3ca5e7daa83515883f31a61a5177aebf99d7db6bdfc398c010000000163ffffffff01d5562d0100000000016300000000", "5265ac5165ac5252ab", 0, 1055129103, "5eeb03e03806cd7bfd44bbba69c30f84c2c5120df9e68cd8facc605fcfbc9693"],
                ["5ff2cac201423064a4d87a96b88f1669b33adddc6fa9acdc840c0d8a243671e0e6de49a5b00300000005ac6353655353b91db50180db5a03000000000663535151006a047a3aff", "52ab51ab5365005163", 0, -1336626596, "b8db8d57fe40ab3a99cf2f8ed57da7a65050fcc1d34d4280e25faf10108d3110"],
                ["10011f150220ad76a50ccc7bb1a015eda0ff987e64cd447f84b0afb8dc3060bdae5b36a6900200000000ffffffff1e92dd814dfafa830187bc8e5b9258de2445ec07b02c420ee5181d0b203bb334000000000565ab536a65ffffffff0124e65401000000000800ab636553ab53ac00000000", "53abab0051", 0, 440222748, "c6675bf229737e005b5c8ffa6f81d9e2c4396840921b6151316f67c4315a4270"],
                ["8b95ec900456648d820a9b8df1d8f816db647df8a8dc9f6e7151ebf6079d90ee3f6861352a02000000085200ab00ac535151ffffffff039b10b845f961225ac0bcaac4f5fe1991029a051aa3d06a3811b5762977a67403000000035252abffffffff8559d65f40d5e261f45aec8aad3d2c56c6114b22b26f7ee54a06f0881be3a7f5010000000765635252536363ffffffff38f8b003b50f6412feb2322b06b270197f81ad69c36af02ca5008b94eee5f650020000000165ffffffff01ae2b00010000000001638eb153a2", "0053ab5300ac53", 2, 1266056769, "205f3653f0142b35ce3ef39625442efebae98cde8cbf0516b97b51073bb0479f"],
                ["babbb7ea01ab5d584727cb44393b17cf66521606dc81e25d85273be0d57bad43e8f6b6d43501000000036a656aba83a68803fb0f4a000000000005536353ab633fcfe4020000000009ac00acab6351006a65182a0c03000000000453ac5363bee74f44", "536a6a6a6365ac51ab", 0, -799187625, "3275e98dca37243b977525a07b5d8e369d6c3bdc08cb948029a635547d0d1a4e"],
                ["e86a24bc03e4fae784cdf81b24d120348cb5e52d937cd9055402fdba7e43281e482e77a1c100000000046363006affffffffa5447e9bdcdab22bd20d88b19795d4c8fb263fbbf7ce8f4f9a85f865953a6325020000000663ac53535253ffffffff9f8b693bc84e0101fc73748e0513a8cecdc264270d8a4ee1a1b6717607ee1eaa00000000026a513417bf980158d82c020000000009005253005351acac5200000000", "6353516365536a6a", 2, -563792735, "508129278ef07b43112ac32faf00170ad38a500eed97615a860fd58baaad174b"],
                ["53bd749603798ed78798ef0f1861b498fc61dcee2ee0f2b37cddb115b118e73bc6a5a47a0201000000096a63656a6aab6a000007ff674a0d74f8b4be9d2e8e654840e99d533263adbdd0cf083fa1d5dd38e44d2d163d900100000007abab5251ac6a51c8b6b63f744a9b9273ccfdd47ceb05d3be6400c1ed0f7283d32b34a7f4f0889cccf06be30000000009516a52636551ab516a9ac1fe63030c677e05000000000027bc610000000000086565636a635100526e2dc60200000000015300000000", "6552536a515351ab", 1, -1617066878, "fe516df92299e995b8e6489be824c6839543071ec5e9286060b2600935bf1f20"],
                ["691bf9fc028ca3099020b79184e70039cf53b3c7b3fe695d661fd62d7b433e65feda2150610000000003ac63abffffffff2c814c15b142bc944192bddccb90a392cd05b968b599c1d8cd99a55a28a243fd0100000009ab5300526a5200abac98516a5803dfd3540500000000046552ac522838120100000000040053ab6a4409a903000000000665636a5300658759621b", "65ac5165ab", 0, -359941441, "d582c442e0ecc400c7ba33a56c93ad9c8cfd45af820350a13623594b793486f0"],
                ["536bc5e60232eb60954587667d6bcdd19a49048d67a027383cc0c2a29a48b960dc38c5a0370300000005ac636300abffffffff8f1cfc102f39b1c9348a2195d496e602c77d9f57e0769dabde7eaaedf9c69e250100000006acabab6a6351ffffffff0432f56f0400000000046a5365517fd54b0400000000035265539484e4050000000003536a5376dc25020000000008ac536aab6aab536ab978e686", "ac0051006a006a006a", 0, -273074082, "f151f1ec305f698d9fdce18ea292b145a58d931f1518cf2a4c83484d9a429638"],
                ["74606eba01c2f98b86c29ba5a32dc7a7807c2abe6ed8d89435b3da875d87c12ae05329e6070200000003510052ffffffff02a1e2c4020000000006516563526a63c68bae04000000000952ab6363ab00006363fe19ae4f", "63ababacac5365", 0, 112323400, "d1b1d79001b4a0324962607b739972d6f39c1493c4500ce814fd3bd72d32a5a0"],
                ["2ed805e20399e52b5bcc9dc075dad5cf19049ff5d7f3de1a77aee9288e59c5f4986751483f020000000165ffffffff967531a5726e7a653a9db75bd3d5208fa3e2c5e6cd5970c4d3aba84eb644c72c0300000000ffffffffd79030d20c65e5f8d3c55b5692e5bdaa2ae78cfa1935a0282efb97515feac43f030000000400006365261ab88c02bdf66a000000000003ab6351d6ad8b000000000005525152abac00000000", "630053ab5265", 0, 2072814938, "1d25d16d84d5793be1ad5cda2de9c9cf70e04a66c3dae618f1a7ca4026198e7f"],
                ["fab796ee03f737f07669160d1f1c8bf0800041157e3ac7961fea33a293f976d79ce49c02ab0200000003ac5252eb097ea1a6d1a7ae9dace338505ba559e579a1ee98a2e9ad96f30696d6337adcda5a85f403000000096500abab656a6a656396d5d41a9b11f571d91e4242ddc0cf2420eca796ad4882ef1251e84e42b930398ec69dd80100000005526551ac6a8e5d0de804f763bb0400000000015288271a010000000001acf2bf2905000000000300ab51c9641500000000000952655363636365ac5100000000", "00ac536552", 0, -1854521113, "f3bbab70b759fe6cfae1bf349ce10716dbc64f6e9b32916904be4386eb461f1f"],
                ["f2b539a401e4e8402869d5e1502dbc3156dbce93583f516a4947b333260d5af1a34810c6a00200000003525363ffffffff01d305e2000000000005acab535200a265fe77", "", 0, -1435650456, "41617b27321a830c712638dbb156dae23d4ef181c7a06728ccbf3153ec53d7dd"],
                ["9f10b1d8033aee81ac04d84ceee0c03416a784d1017a2af8f8a34d2f56b767aea28ff88c8f02000000025352ffffffff748cb29843bea8e9c44ed5ff258df1faf55fbb9146870b8d76454786c4549de100000000016a5ba089417305424d05112c0ca445bc7107339083e7da15e430050d578f034ec0c589223b0200000007abac53ac6565abffffffff025a4ecd010000000006636563ab65ab40d2700000000000056a6553526333fa296c", "", 0, -395044364, "20fd0eee5b5716d6cbc0ddf852614b686e7a1534693570809f6719b6fcb0a626"],
                ["ab81755f02b325cbd2377acd416374806aa51482f9cc5c3b72991e64f459a25d0ddb52e66703000000036a00ab8727056d48c00cc6e6222be6608c721bc2b1e69d0ffbadd51d131f05ec54bcd83003aac5000000000003f2cdb60454630e020000000007526aac63000000e9e25c040000000003516a0088c97e0000000000076a535265655263771b5805000000000851ab00ac6565515100000000", "5151ab00ac", 0, -230931127, "ba0a2c987fcdd74b6915f6462f62c3f126a0750aa70048f7aa20f70726e6a20b"],
                ["7a17e0ef0378dab4c601240639139335da3b7d684600fa682f59b7346ef39386fe9abd69350000000004ac5252ab807f26fb3249326813e18260a603b9ad66f41f05eaa8146f66bcca452162a502aac4aa8b02000000026a534ea460faa7e3d7854ec6c70d7e797025697b547ec500b2c09c873b4d5517767d3f3720660300000000ffffffff01b12e7a02000000000900ab006aab65656a63991c03e2", "6aab6a", 1, -1577994103, "62cd3413d9d819fb7355336365cf8a2a997f7436cc050a7143972044343b3281"],
                ["ff2ecc09041b4cf5abb7b760e910b775268abee2792c7f21cc5301dd3fecc1b4233ee70a2c0200000009acac5300006a51526affffffffeb39c195a5426afff38379fc85369771e4933587218ef4968f3f05c51d6b7c92000000000165453a5f039b8dbef7c1ffdc70ac383b481f72f99f52b0b3a5903c825c45cfa5d2c0642cd50200000001654b5038e6c49daea8c0a9ac8611cfe904fc206dad03a41fb4e5b1d6d85b1ecad73ecd4c0102000000096a51000053ab656565bdb5548302cc719200000000000452655265214a3603000000000300ab6a00000000", "52516a006a63", 1, -2113289251, "37ed6fae36fcb3360c69cac8b359daa62230fc1419b2cf992a32d8f3e079dcff"],
                ["70a8577804e553e462a859375957db68cfdf724d68caeacf08995e80d7fa93db7ebc04519d02000000045352ab53619f4f2a428109c5fcf9fee634a2ab92f4a09dc01a5015e8ecb3fc0d9279c4a77fb27e900000000006ab6a51006a6affffffff3ed1a0a0d03f25c5e8d279bb5d931b7eb7e99c8203306a6c310db113419a69ad010000000565516300abffffffff6bf668d4ff5005ef73a1b0c51f32e8235e67ab31fe019bf131e1382050b39a630000000004536a6563ffffffff02faf0bb00000000000163cf2b4b05000000000752ac635363acac15ab369f", "ac", 0, -1175809030, "1c9d6816c20865849078f9777544b5ddf37c8620fe7bd1618e4b72fb72dddca1"],
                ["a3604e5304caa5a6ba3c257c20b45dcd468f2c732a8ca59016e77b6476ac741ce8b16ca8360200000004acac6553ffffffff695e7006495517e0b79bd4770f955040610e74d35f01e41c9932ab8ccfa3b55d0300000007ac5253515365acffffffff6153120efc5d73cd959d72566fc829a4eb00b3ef1a5bd3559677fb5aae116e38000000000400abab52c29e7abd06ff98372a3a06227386609adc7665a602e511cadcb06377cc6ac0b8f63d4fdb03000000055100acabacffffffff04209073050000000009ab5163ac525253ab6514462e05000000000952abacab636300656a20672c0400000000025153b276990000000000056565ab6a5300000000", "5351", 0, 1460890590, "249c4513a49076c6618aabf736dfd5ae2172be4311844a62cf313950b4ba94be"],
                ["c6a72ed403313b7d027f6864e705ec6b5fa52eb99169f8ea7cd884f5cdb830a150cebade870100000009ac63ab516565ab6a51ffffffff398d5838735ff43c390ca418593dbe43f3445ba69394a6d665b5dc3b4769b5d700000000075265acab515365ffffffff7ee5616a1ee105fd18189806a477300e2a9cf836bf8035464e8192a0d785eea3030000000700ac6a51516a52ffffffff018075fd0000000000015100000000", "005251acac5252", 2, -656067295, "2cc1c7514fdc512fd45ca7ba4f7be8a9fe6d3318328bc1a61ae6e7675047e654"],
                ["93c12cc30270fc4370c960665b8f774e07942a627c83e58e860e38bd6b0aa2cb7a2c1e060901000000036300abffffffff4d9b618035f9175f564837f733a2b108c0f462f28818093372eec070d9f0a5440300000001acffffffff039c2137020000000001525500990100000000055265ab636a07980e0300000000005ba0e9d1", "656a5100", 1, 18954182, "6beca0e0388f824ca33bf3589087a3c8ad0857f9fe7b7609ae3704bef0eb83e2"],
                ["97bddc63015f1767619d56598ad0eb5c7e9f880b24a928fea1e040e95429c930c1dc653bdb0100000008ac53acac00005152aaa94eb90235ed10040000000000287bdd0400000000016a8077673a", "acac6a536352655252", 0, -813649781, "5990b139451847343c9bb89cdba0e6daee6850b60e5b7ea505b04efba15f5d92"],
                ["cc3c9dd303637839fb727270261d8e9ddb8a21b7f6cbdcf07015ba1e5cf01dc3c3a327745d0300000000d2d7804fe20a9fca9659a0e49f258800304580499e8753046276062f69dbbde85d17cd2201000000096352536a520000acabffffffffbc75dfa9b5f81f3552e4143e08f485dfb97ae6187330e6cd6752de6c21bdfd21030000000600ab53650063ffffffff0313d0140400000000096565515253526aacac167f0a040000000008acab00535263536a9a52f8030000000006abab5151ab63f75b66f2", "6a635353636a65ac65", 1, 377286607, "dbc7935d718328d23d73f8a6dc4f53a267b8d4d9816d0091f33823bd1f0233e9"],
                ["236f91b702b8ffea3b890700b6f91af713480769dda5a085ae219c8737ebae90ff25915a3203000000056300ac6300811a6a10230f12c9faa28dae5be2ebe93f37c06a79e76214feba49bb017fb25305ff84eb020000000100ffffffff041e351703000000000351ac004ff53e050000000003ab53636c1460010000000000cb55f701000000000651520051ab0000000000", "acac636a6aac5300", 0, 406448919, "793a3d3c37f6494fab79ff10c16702de002f63e34be25dd8561f424b0ea938c4"],
                ["22e10d2003ab4ea9849a2801921113583b7c35c3710ff49a6003489395789a7cfb1e6051900100000006526a65535151ffffffff82f21e249ec60db33831d33b9ead0d56f6496db64337dcb7f1c3327c47729c4a020000000253abffffffff138f098f0e6a4cf51dc3e7a3b749f487d1ebde71b73b731d1d02ad1180ac7b8c02000000036563acda215011027a9484020000000007635165530000ac4bf6cb0400000000066aacabab65ab3ce3f32c", "ab0052ab", 2, 1136359457, "b5bd080bbcb8cd652f440484311d7a3cb6a973cd48f03c5c00fd6beb52dfc061"],
                ["c47d5ad60485cb2f7a825587b95ea665a593769191382852f3514a486d7a7a11d220b62c54000000000663655253acab8c3cf32b0285b040e50dcf6987ddf7c385b3665048ad2f9317b9e0c5ba0405d8fde4129b00000000095251ab00ac65635300ffffffff549fe963ee410d6435bb2ed3042a7c294d0c7382a83edefba8582a2064af3265000000000152fffffffff7737a85e0e94c2d19cd1cde47328ece04b3e33cd60f24a8a345da7f2a96a6d0000000000865ab6a0051656aab28ff30d5049613ea020000000005ac51000063f06df1050000000008ac63516aabac5153afef5901000000000700656500655253688bc00000000000086aab5352526a53521ff1d5ff", "51ac52", 2, -1296011911, "0c1fd44476ff28bf603ad4f306e8b6c7f0135a441dc3194a6f227cb54598642a"],
                ["0b43f122032f182366541e7ee18562eb5f39bc7a8e5e0d3c398f7e306e551cdef773941918030000000863006351ac51acabffffffffae586660c8ff43355b685dfa8676a370799865fbc4b641c5a962f0849a13d8250100000005abab63acabffffffff0b2b6b800d8e77807cf130de6286b237717957658443674df047a2ab18e413860100000008ab6aac655200ab63ffffffff04f1dbca03000000000800635253ab656a52a6eefd0300000000036365655d8ca90200000000005a0d530400000000015300000000", "65ac65acac", 0, 351448685, "86f26e23822afd1bdfc9fff92840fc1e60089f12f54439e3ab9e5167d0361dcf"],
                ["4b0ecc0c03ba35700d2a30a71f28e432ff6ac7e357533b49f4e97cf28f1071119ad6b97f3e0300000008acab516363ac63acffffffffcd6a2019d99b5c2d639ddca0b1aa5ea7c1326a071255ea226960bd88f45ca57d00000000085253655363005353ffffffffba257635191c9f216de3277be548cb5a2313114cb1a4c563b03b4ef6c0f4f7040300000001abda542edf0495cdc40100000000026353c049e903000000000752516a53ab65512b0f9304000000000963ab516aac65516552fa9ece050000000009acab6500005152530000000000", "65ab51525352510052", 1, -1355414590, "3cd85f84aae6d702436f3f9b8980adcc1f8f202e957759540a27da0a32fc6c87"],
                ["adaac0a803f66811346271c733036d6e0d45e15a9b602092e2e04ad93564f196e7f020b088000000000600526a636a00700ec3f9db07a3a6ce910bf318c7ec87a876e1f2a3366cc69f20cde09203b99c1cb9d15800000000050000ac636a4d0de554ebe95c6cc14faf5ff6361d1deba9474b8b0fd3b93c011cd96aec783abb3f36830200000005ab65005251ffffffff0464eb10050000000007520000ab6a65ab1beaa80300000000005a2f31050000000006526aab65ac52ba7db10000000000045251ab6a0cfb46e7", "ab0051ac52636a", 1, -184733716, "961ff413850336d3987c550404fc1d923266ca36cc9ffee7113edb3a9fea7f30"],
                ["af1c4ab301ec462f76ee69ba419b1b2557b7ded639f3442a3522d4f9170b2d6859765c3df402000000016affffffff01a5ca6c000000000008ab52536aab00005300000000", "6a6351", 0, 110304602, "e88ed2eea9143f2517b15c03db00767eb01a5ce12193b99b964a35700607e5f4"],
                ["0bfd34210451c92cdfa02125a62ba365448e11ff1db3fb8bc84f1c7e5615da40233a8cd368010000000252ac9a070cd88dec5cf9aed1eab10d19529720e12c52d3a21b92c6fdb589d056908e43ea910e0200000009ac516a52656a6a5165ffffffffc3edcca8d2f61f34a5296c405c5f6bc58276416c720c956ff277f1fb81541ddd00000000030063abffffffff811247905cdfc973d179c03014c01e37d44e78f087233444dfdce1d1389d97c302000000065163000063ab1724a26e02ca37c902000000000851ab53525352ac529012a90100000000085200525253535353fa32575b", "5352ac6351", 1, -1087700448, "b8f1e1f35e3e1368bd17008c756e59cced216b3c699bcd7bebdb5b6c8eec4697"],
                ["2c84c0640487a4a695751d3e4be48019dbaea85a6e854f796881697383ea455347d2b2769001000000055265526500ffffffff6aac176d8aa00778d496a7231eeb7d3334f20c512d3db1683276402100d98de5030000000700536a5263526ac1ee9ceb171c0c984ebaf12c234fd1487fbf3b3d73aa0756907f26837efba78d1bed33200300000001ab4d9e8ec0bed837cb929bbed76ee848959cec59de44bd7667b7631a744f880d5c71a20cfd0100000007005363515300abffffffff023753fb0000000000036565532d3873050000000009005152ab6a63acab5200000000", "ab650053ab", 0, -877941183, "c49af297dffe2d80deddf10ceea84b99f8554bd2d55bbdc34e449728c31f0835"],
                ["1f7e4b1b045d3efa6cd7a11d7873a8bab886c19bd11fcb6712f0948f2db3a7be76ff76c8f100000000095265ab6a0065ac5363ffffffffdaafcfa6029336c997680a541725190f09a6f6da21e54560eca4b5b8ae987da1000000000952ac52acac52515165ffffffff825a38d3b1e5bb4d10f33653ab3ab6882c7abdaec74460257d1528ce7be3f98e0100000007526a006a656a63c14adc8f04953a5d3d3f89237f38b857dd357713896d36215f7e8b77b11d98ea3cdc93df02000000015212484f6104bfafae0300000000025263a2b0120000000000056563ab00516c4d2605000000000653ac6500655301cc93030000000002acab14643b1f", "63acac53ab", 0, 333824258, "18da6ceb011cd36f15ad7dd6c55ef07e6f6ed48881ce3bb31416d3c290d9a0e9"],
                ["467a3e7602e6d1a7a531106791845ec3908a29b833598e41f610ef83d02a7da3a1900bf2960000000005ab6a636353ffffffff031db6dac6f0bafafe723b9199420217ad2c94221b6880654f2b35114f44b1df010000000965ab52636a63ac6352ffffffff02b3b95c0100000000026300703216030000000001ab3261c0aa", "6a", 0, 2110869267, "3078b1d1a7713c6d101c64afe35adfae0977a5ab4c7e07a0b170b041258adbf2"],
                ["8713bc4f01b411149d575ebae575f5dd7e456198d61d238695df459dd9b86c4e3b2734b62e0300000004abac6363ffffffff03b58049050000000002ac653c714c04000000000953656a005151526a527b5a9e03000000000652ac5100525300000000", "52", 0, -647281251, "0e0bed1bf2ff255aef6e5c587f879ae0be6222ab33bd75ee365ec6fbb8acbe38"],
                ["f2ba8a8701b9c401efe3dd0695d655e20532b90ac0142768cee4a3bb0a89646758f544aa8102000000036a52527899f4e4040c6f0b030000000008636565ab530051ab52b60c000000000009515200ab630053ac53a49c5f040000000008ab53ab516300ab63fa27340300000000015100000000", "ac63abab5251", 0, -1328936437, "ab61497afd39e61fe06bc5677326919716f9b20083c9f3417dcea905090e0411"],
                ["b5a7df6102107beded33ae7f1dec0531d4829dff7477260925aa2cba54119b7a07d92d5a1d02000000046a516a52803b625c334c1d2107a326538a3db92c6c6ae3f7c3516cd90a09b619ec6f58d10e77bd6703000000056563006a63ffffffff0117484b03000000000853acab52526a65abc1b548a1", "ac006a525100", 0, 2074359913, "680336db57347d8183b8898cd27a83f1ba5884155aeae5ce20b4840b75e12871"],
                ["278cb16204b9dadf400266106392c4aa9df01ba03af988c8139dae4c1818ac009f13fc5f1a00000000065200ac656a52ffffffffd006bbebd8cbd7bdead24cddc9badfcc6bc0c2e63c037e5c29aa858f5d0f3e7d01000000046a0051acffffffffbc62a5f57e58da0b67956003ae81ac97cb4cbd1d694c914fc41515c008c4d8fd020000000165e329c844bcc16164be64b64a81cbf4ffd41ed2934e0daa0040ccb8365bab0b2a9e401c180300000003ab52abffffffff02588460030000000000a25a12030000000005535100005300000000", "6553ab6a5300acab51", 3, 989407546, "1c29f110576f4a3b257f67454d99dfc0dee62ef5517ca702848ce4bd2ea1a1d7"],
                ["49eb2178020a04fca08612c34959fd41447319c190fb7ffed9f71c235aa77bec28703aa1820200000003ac6353abaff326071f07ec6b77fb651af06e8e8bd171068ec96b52ed584de1d71437fed186aecf0300000001acffffffff03da3dbe02000000000652ac63ac6aab8f3b680400000000096a536a65636a53516a5175470100000000016500000000", "6a536365", 0, 1283691249, "c670219a93234929f662ecb9aa148a85a2d281e83f4e53d10509461cdea47979"],
                ["0f96cea9019b4b3233c0485d5b1bad770c246fe8d4a58fb24c3b7dfdb3b0fd90ea4e8e947f0300000006006a5163515303571e1e01906956030000000005ab635353abadc0fbbe", "acac", 0, -1491469027, "716a8180e417228f769dcb49e0491e3fda63badf3d5ea0ceeac7970d483dd7e2"],
                ["9a7d858604577171f5fe3f3fd3e5e039c4b0a06717a5381e9977d80e9f53e025e0f16d2877020000000752636565536353ffffffff5862bd028e8276e63f044be1dddcbb8d0c3fa097678308abf2b0f45104a93dbd0100000001531200667ba8fdd3b28e98a35da73d3ddfe51e210303d8eb580f923de988ee632d77793892030000000752526363526563ffffffffe9744eb44db2658f120847c77f47786d268c302120d269e6004455aa3ea5f5e20200000009ab6300636aab656551ffffffff03c61a3c020000000009ab516a6aab6aab53ab737f1a05000000000853acabab655365ab92a4a00400000000016367edf6c8", "535352ab", 3, 659348595, "d36ee79fc80db2e63e05cdc50357d186181b40ae20e3720878284228a13ee8b3"],
                ["148e68480196eb52529af8e83e14127cbfdbd4a174e60a86ac2d86eac9665f46f4447cf7aa01000000045200ac538f8f871401cf240c0300000000065252ab52656a5266cf61", "", 0, -344314825, "eacc47c5a53734d6ae3aedbc6a7c0a75a1565310851b29ef0342dc4745ceb607"],
                ["e2bc29d4013660631ba14ecf75c60ec5e9bed7237524d8c10f66d0675daa66d1492cb834530200000004ac510065e42d0c9e04f2b26c01000000000951525152acac65ababa35b7504000000000953ac6aac00650053ab94688c0400000000056365526553a1bced0300000000016a00000000", "65ab0063655353", 0, -888431789, "59a34b3ed3a1cce0b104de8f7d733f2d386ffc7445efae67680cd90bc915f7e0"],
                ["0c8a70d70494dca6ab05b2bc941b5b431c43a292bd8f2f02eab5e240a408ca73a676044a4103000000056a51ab006affffffff84496004e54836c035821f14439149f22e1db834f315b24588ba2f031511926c0100000000ffffffffbbc5e70ed1c3060ba1bfe99c1656a3158a7307c3ce8eb362ec32c668596d2bd30000000009636563635351abab00b039344c6fc4f9bec24322e45407af271b2d3dfec5f259ee2fc7227bc5285e22b3be85b40100000009ac00ab53abac6a5352e5ddfcff02d50231020000000005006a51536ab086d9020000000006ababac51ac6a00000000", "abab636565acac6a", 3, 241546088, "643a7b4c8d832e14d5c10762e74ec84f2c3f7ed96c03053157f1bed226614911"],
                ["f98f79cf0274b745e1d6f36da7cbe205a79132a7ad462bdc434cfb1dcd62a6977c3d2a5dbc010000000553516a5365ffffffff4f89f485b53cdad7fb80cc1b7e314b9735b9383bc92c1248bb0e5c6173a55c0d010000000353655293f9b014045ad96d02000000000963ac526a53ac636365f4c27904000000000952536563635152526a2788f0030000000002516aff5add01000000000863530051655351abd04716ba", "ab6552536a53", 1, -2128899945, "56d29f5e300ddfed2cd8dcce5d79826e193981d0b70dc7487772c8a0b3b8d7b1"],
                ["6c7913f902aa3f5f939dd1615114ce961beda7c1e0dd195be36a2f0d9d047c28ac62738c3a020000000453abac00ffffffff477bf2c5b5c6733881447ac1ecaff3a6f80d7016eee3513f382ad7f554015b970100000007ab6563acab5152ffffffff04e58fe1040000000009ab00526aabab526553e59790010000000002ab525a834b03000000000035fdaf0200000000086551ac65515200ab00000000", "63ac53", 1, 1285478169, "1536da582a0b6de017862445e91ba14181bd6bf953f4de2f46b040d351a747c9"],
                ["4624aa9204584f06a8a325c84e3b108cafb97a387af62dc9eab9afd85ae5e2c71e593a3b690200000003636a005eb2b44eabbaeca6257c442fea00107c80e32e8715a1293cc164a42e62ce14fea146220c020000000090b9ee38106e3310037bfc519fd209bdbd21c588522a0e96df5fba4e979392bc993bfe9f01000000086363636a635353ab6f1907d218ef6f3c729d9200e23c1dbff2df58b8b1282c6717b26cf760ee4c880d23f4d100000000086a516a536a525163ffffffff01d6f162050000000000ebbab208", "525365ab0053", 1, -1515409325, "6cf9cd409b7185b1f118171f0a34217af5b612ea54195ea186505b667c19337f"],
                ["16562fc503f1cf9113987040c408bfd4523f1512da699a2ca6ba122dc65677a4c9bf7763830000000003636552ffffffff1ec1fab5ff099d1c8e6b068156f4e39b5543286bab53c6d61e2582d1e07c96cf02000000045163656affffffffd0ef40003524d54c08cb4d13a5ee61c84fbb28cde9eca7a6d11ba3a9335d8c620100000007635153536a6300fbb84fc2012003a601000000000363ab6a00000000", "63636a006a6aab", 0, -1310262675, "1efbf3d37a92bc03d9eb950b792f307e95504f7c4998f668aa250707ebb752ac"],
                ["531665d701f86bacbdb881c317ef60d9cd1baeffb2475e57d3b282cd9225e2a3bf9cbe0ded01000000086300ac515263acabffffffff0453a8500100000000086353acab516a6565e5e9200500000000026a52a44caa00000000000453ac000065e41b0500000000076500ac0065526ab4476f4d", "006563006aab00636a", 0, 1770013777, "0898b26dd3ca08632a5131fa48eb55b44386d0c5070c24d6e329673d5e3693b8"],
                ["0f1227a20140655a3da36e413b9b5d108a866f6f147eb4940f032f5a89854eae6d7c3a91600100000009525363515153515253e37a79480161ab61020000000001ab00000000", "ab65005200", 0, -1996383599, "979782dc3f36d908d37d7e4046a38d306b4b08ddc60a5eba355fe3d6da1b29a9"],
                ["063ff6eb01aff98d0d2a6db224475010edb634c2f3b46257084676adeb84165a4ff8558d7601000000066353006a5165deb3262c042d109c0000000000076363ab52ac005200b9c4050000000007516300ac510063cfffc800000000000200639e815501000000000700526a52ac6365ac7b07b8", "656552abac6500", 0, -1559847112, "674a4bcb04247f8dc98780f1792cac86b8aee41a800fc1e6f5032f6e1dccde65"],
                ["3320f6730132f830c4681d0cae542188e4177cad5d526fae84565c60ceb5c0118e844f90bd030000000163ffffffff0257ec5a040000000005525251ac6538344d000000000002515200000000", "5352656a53ac516a65", 0, 788050308, "3afacaca0ef6be9d39e71d7b1b118994f99e4ea5973c9107ca687d28d8eba485"],
                ["c13aa4b702eedd7cde09d0416e649a890d40e675aa9b5b6d6912686e20e9b9e10dbd40abb1000000000863ab6353515351ac11d24dc4cc22ded7cdbc13edd3f87bd4b226eda3e4408853a57bcd1becf2df2a1671fd1600000000045165516affffffff01baea300100000000076aab52ab53005300000000", "0065", 0, -1195908377, "241a23e7b1982d5f78917ed97a8678087acbbffe7f624b81df78a5fe5e41e754"],
                ["d9a6f20e019dd1b5fae897fb472843903f9c3c2293a0ffb59cff2b413bae6eceab574aaf9d030000000663ab006a515102f54939032df5100100000000056a51ab65530ec28f010000000004ac5100007e874905000000000651005265ac6a00000000", "abacab63acacabab", 0, 271463254, "1326a46f4c21e7619f30a992719a905aa1632aaf481a57e1cbd7d7c22139b41e"],
                ["157c81bf0490432b3fcb3f9a5b79e5f91f67f05efb89fa1c8740a3fe7e9bdc18d7cb6acd2203000000026351ffffffff912e48e72bbcf8a540b693cf8b028e532a950e6e63a28801f6eaad1afcc52ad00000000000b1a4b170a2b9e60e0cad88a0085137309f6807d25d5afb5c1e1d32aa10ba1cdf7df596dd0000000009525165656a51ab65ab3674fba32a76fe09b273618d5f14124465933f4190ba4e0fd09d838daafc6223b31642ac00000000086a53536551ac6565ffffffff01fe9fb6030000000008ab51656a5165636a00000000", "ab00ab6a6551", 3, -64357617, "1ddaab7f973551d71f16bd70c4c4edbf7225e64e784a6da0ee7f7a9fe4f12a0b"],
                ["a2692fff03b2387f5bacd5640c86ba7df574a0ee9ed7f66f22c73cccaef3907eae791cbd230200000004536363abffffffff4d9fe7e5b375de88ba48925d9b2005447a69ea2e00495a96eafb2f144ad475b40000000008000053000052636537259bee3cedd3dcc07c8f423739690c590dc195274a7d398fa196af37f3e9b4a1413f810000000006ac63acac52abffffffff04c65fe60200000000075151536365ab657236fc020000000009005263ab00656a6a5195b8b6030000000007ac5165636aac6a7d7b66010000000002acab00000000", "51", 2, -826546582, "925037c7dc7625f3f12dc83904755a37016560de8e1cdd153c88270a7201cf15"],
                ["2c5b003201b88654ac2d02ff6762446cb5a4af77586f05e65ee5d54680cea13291efcf930d0100000005ab536a006a37423d2504100367000000000004536a515335149800000000000152166aeb03000000000452510063226c8e03000000000000000000", "635251", 0, 1060344799, "7e058ca5dd07640e4aae7dea731cfb7d7fef1bfd0d6d7b6ce109d041f4ca2a31"],
                ["f981b9e104acb93b9a7e2375080f3ea0e7a94ce54cd8fb25c57992fa8042bdf4378572859f0100000002630008604febba7e4837da77084d5d1b81965e0ea0deb6d61278b6be8627b0d9a2ecd7aeb06a0300000005ac5353536a42af3ef15ce7a2cd60482fc0d191c4236e66b4b48c9018d7dbe4db820f5925aad0e8b52a0300000008ab0063510052516301863715efc8608bf69c0343f18fb81a8b0c720898a3563eca8fe630736c0440a179129d03000000086aac6a52ac6a63ac44fec4c00408320a03000000000062c21c030000000007ac6a655263006553835f0100000000015303cd60000000000005535263536558b596e0", "00", 0, -2140385880, "49870a961263354c9baf108c6979b28261f99b374e97605baa532d9fa3848797"],
                ["e7416df901269b7af14a13d9d0507709b3cd751f586ce9d5da8d16a121e1bd481f5a086e1103000000056aab005200ffffffff01aa269c040000000006acac6a6a5263ee718de6", "ab525363", 0, 1309186551, "eea7d2212bda2d408fff146f9ae5e85e6b640a93b9362622bb9d5e6e36798389"],
                ["402a815902193073625ab13d876190d1bbb72aecb0ea733c3330f2a4c2fe6146f322d8843a0300000008656aab0000535363fffffffff9dccdec5d8509d9297d26dfcb1e789cf02236c77dc4b90ebccbf94d1b5821150300000001510bf1f96a03c5c145000000000002ac6ae11b1c0100000000055163516a5239c8a600000000000365636300000000", "63536aacab", 0, -1811424955, "0090803a20102a778ab967a74532faee13e03b702083b090b1497bc2267ee2fe"],
                ["c4b702e502f1a54f235224f0e6de961d2e53b506ab45b9a40805d1dacd35148f0acf24ca5e00000000085200ac65ac53acabf34ba6099135658460de9d9b433b84a8562032723635baf21ca1db561dce1c13a06f4407000000000851ac006a63516aabffffffff02a853a603000000000163d17a67030000000005ab63006a5200000000", "ac5363515153", 1, 480734903, "5c46f7ac3d6460af0da28468fcc5b3c87f2b9093d0f837954b7c8174b4d7b6e7"],
                ["9b83f78704f492b9b353a3faad8d93f688e885030c274856e4037818848b99e490afef27770200000000ffffffff36b60675a5888c0ef4d9e11744ecd90d9fe9e6d8abb4cff5666c898fdce98d9e00000000056aab656352596370fca7a7c139752971e169a1af3e67d7656fc4fc7fd3b98408e607c2f2c836c9f27c030000000653ac51ab6300a0761de7e158947f401b3595b7dc0fe7b75fa9c833d13f1af57b9206e4012de0c41b8124030000000953656a53ab53510052242e5f5601bf83b301000000000465516a6300000000", "63515200ac656365", 3, -150879312, "9cf05990421ea853782e4a2c67118e03434629e7d52ab3f1d55c37cf7d72cdc4"],
                ["f492a9da04f80b679708c01224f68203d5ea2668b1f442ebba16b1aa4301d2fe5b4e2568f3010000000953005351525263ab65ffffffff93b34c3f37d4a66df255b514419105b56d7d60c24bf395415eda3d3d8aa5cd0101000000020065ffffffff9dba34dabdc4f1643b372b6b77fdf2b482b33ed425914bb4b1a61e4fad33cf390000000002ab52ffffffffbbf3dc82f397ef3ee902c5146c8a80d9a1344fa6e38b7abce0f157be7adaefae0000000009515351005365006a51ffffffff021359ba010000000000403fea0200000000095200ac6353abac635300000000", "00ac51acacac", 0, -2115078404, "fd44fc98639ca32c927929196fc3f3594578f4c4bd248156a25c04a65bf3a9f3"],
                ["2f73e0b304f154d3a00fde2fdd40e791295e28d6cb76af9c0fd8547acf3771a02e3a92ba37030000000852ac6351ab6565639aa95467b065cec61b6e7dc4d6192b5536a7c569315fb43f470078b31ed22a55dab8265f02000000080065636a6aab6a53ffffffff9e3addbff52b2aaf9fe49c67017395198a9b71f0aa668c5cb354d06c295a691a0100000000ffffffff45c2b4019abaf05c5e484df982a4a07459204d1343a6ee5badade358141f8f990300000007ac516a6aacac6308655cd601f3bc2f0000000000015200000000", "", 0, -2082053939, "9a95e692e1f78efd3e46bb98f178a1e3a0ef60bd0301d9f064c0e5703dc879c2"],
                ["5a60b9b503553f3c099f775db56af3456330f1e44e67355c4ab290d22764b9144a7b5f959003000000030052acbd63e0564decc8659aa53868be48c1bfcda0a8c9857b0db32a217bc8b46d9e7323fe9649020000000553ac6551abd0ecf806211db989bead96c09c7f3ec5f73c1411d3329d47d12f9e46678f09bac0dc383e0200000000ffffffff01494bb202000000000500516551ac00000000", "ac", 0, 1169947809, "62a36c6e8da037202fa8aeae03e533665376d5a4e0a854fc4624a75ec52e4eb1"],
                ["7e98d353045569c52347ca0ff2fdba608829e744f61eb779ffdb5830aae0e6d6857ab2690e03000000075365acab656352ffffffffa890dd37818776d12da8dca53d02d243ef23b4535c67016f4c58103eed85360f030000000093dbacdc25ca65d2951e047d6102c4a7da5e37f3d5e3c8b87c29b489360725dcd117ee2003000000056a6300ac53c7e99fa1dc2b8b51733034e6555f6d6de47dbbf1026effac7db80cb2080678687380dc1e02000000075352005263516affffffff04423272040000000008ab6353ab65510051e0f53b0500000000086300516552635152f74a5f04000000000853acab0053ab52ab0e8e5f00000000000951ac5363516a6aabab00000000", "6a5163ab52", 3, 890006103, "476868cecd1763c91dade98f17defa42d31049547df45acffa1cc5ae5c3d75d6"],
                ["e3649aa40405e6ffe377dbb1bbbb672a40d8424c430fa6512c6165273a2b9b6afa9949ec430200000007630052ab655153a365f62f2792fa90c784efe3f0981134d72aac0b1e1578097132c7f0406671457c332b84020000000353ab6ad780f40cf51be22bb4ff755434779c7f1def4999e4f289d2bd23d142f36b66fbe5cfbb4b01000000076a5252abac52ab1430ffdc67127c9c0fc97dcd4b578dab64f4fb9550d2b59d599773962077a563e8b6732c02000000016affffffff04cb2687000000000002ab636e320904000000000252acf70e9401000000000100dc3393050000000006ab0063536aacbc231765", "65520053", 3, -2016196547, "f64f805f0ff7f237359fa6b0e58085f3c766d1859003332223444fd29144112a"],
                ["1d033569040700441686672832b531ab55db89b50dc1f9fc00fb72218b652da9dcfbc83be901000000066551ac526a632b390f9ad068e5fdee6563e88e2a8e4e09763c861072713dc069893dc6bbc9db3f00e26502000000096a5363526565525252ffffffff8a36bdd0aaf38f6707592d203e14476ca9f259021e487135c7e8324244057ed90300000000ed3fb2a3dfd4d46b5f3603fe0148653911988457bd0ed7f742b07c452f5476c228ff9f600200000007526aac00525152ffffffff04b88e48030000000000c753d602000000000853510000006553518fda2603000000000853ac52acac5263534839f1030000000006ac006aacac5300000000", "516553635300ab0052", 1, 2075958316, "c2cefaec2293134acbcf6d2a8bf2b3eb42e4ec04ee8f8bf30ff23e65680677c1"],
                ["4c4be7540344050e3044f0f1d628039a334a7c1f7b4573469cfea46101d6888bb6161fe9710200000000ffffffffac85a4fdad641d8e28523f78cf5b0f4dc74e6c5d903c10b358dd13a5a1fd8a06000000000163e0ae75d05616b72467b691dc207fe2e65ea35e2eadb7e06ea442b2adb9715f212c0924f10200000000ffffffff0194ddfe02000000000265ac00000000", "00006500", 1, -479922562, "d66924d49f03a6960d3ca479f3415d638c45889ce9ab05e25b65ac260b51d634"],
                ["202c18eb012bc0a987e69e205aea63f0f0c089f96dd8f0e9fcde199f2f37892b1d4e6da90302000000055352ac6565ffffffff0257e5450100000000025300ad257203000000000000000000", "520052ac6a005265", 0, 168054797, "502967a6f999f7ee25610a443caf8653dda288e6d644a77537bcc115a8a29894"],
                ["32fa0b0804e6ea101e137665a041cc2350b794e59bf42d9b09088b01cde806ec1bbea077df0200000008515153650000006506a11c55904258fa418e57b88b12724b81153260d3f4c9f080439789a391ab147aabb0fa0000000007000052ac51ab510986f2a15c0d5e05d20dc876dd2dafa435276d53da7b47c393f20900e55f163b97ce0b800000000008ab526a520065636a8087df7d4d9c985fb42308fb09dce704650719140aa6050e8955fa5d2ea46b464a333f870000000009636300636a6565006affffffff01994a0d040000000002536500000000", "516563530065", 2, -163068286, "f58637277d2bc42e18358dc55f7e87e7043f5e33f4ce1fc974e715ef0d3d1c2a"],
                ["ae23424d040cd884ebfb9a815d8f17176980ab8015285e03fdde899449f4ae71e04275e9a80100000007ab006553530053ffffffff018e06db6af519dadc5280c07791c0fd33251500955e43fe4ac747a4df5c54df020000000251ac330e977c0fec6149a1768e0d312fdb53ed9953a3737d7b5d06aad4d86e9970346a4feeb5030000000951ab51ac6563ab526a67cabc431ee3d8111224d5ecdbb7d717aa8fe82ce4a63842c9bd1aa848f111910e5ae1eb0100000004ac515300bfb7e0d7048acddc030000000009636a5253636a655363a3428e040000000001525b99c6050000000004655265ab717e6e020000000000d99011eb", "ac6a6a516565", 1, -716251549, "b098eb9aff1bbd375c70a0cbb9497882ab51f3abfebbf4e1f8d74c0739dc7717"],
                ["030f44fc01b4a9267335a95677bd190c1c12655e64df74addc53b753641259af1a54146baa020000000152e004b56c04ba11780300000000026a53f125f001000000000251acd2cc7c03000000000763536563655363c9b9e50500000000015200000000", "ac", 0, -1351818298, "19dd32190ed2a37be22f0224a9b55b91e37290577c6c346d36d32774db0219a3"],
                ["c05f448f02817740b30652c5681a3b128322f9dc97d166bd4402d39c37c0b14506d8adb5890300000003536353ffffffffa188b430357055ba291c648f951cd2f9b28a2e76353bef391b71a889ba68d5fc02000000056565526a6affffffff02745f73010000000001ab3ec34c0400000000036aac5200000000", "516551510053", 0, -267877178, "3a1c6742d4c374f061b1ebe330b1e169a113a19792a1fdde979b53e094cc4a3c"],
                ["163ba45703dd8c2c5a1c1f8b806afdc710a2a8fc40c0138e2d83e329e0e02a9b6c837ff6b8000000000700655151ab6a522b48b8f134eb1a7e6f5a6fa319ce9d11b36327ba427b7d65ead3b4a6a69f85cda8bbcd22030000000563656552acffffffffdbcf4955232bd11eef0cc6954f3f6279675b2956b9bcc24f08c360894027a60201000000066500006500abffffffff04d0ce9d0200000000008380650000000000015233f360040000000003006aabedcf0801000000000000000000", "000065006500ac", 0, 216965323, "9afe3f4978df6a86e9a8ebd62ef6a9d48a2203f02629349f1864ef2b8b92fd55"],
                ["07f7f5530453a12ad0c7eb8fbc3f140c7ab6818144d67d2d8752600ca5d9a9358e2dff87d4000000000663526aab526a9e599c379d455e2da36d0cde88d931a863a3e97e01e93b9edb65856f3d958dc08b92b720000000000165bbc8d66dae3b1b170a6e2457f5b161465cb8706e0e6ffc6af55deb918365f14c5f40d4890100000000a7bd77c069ee4b48638e2363fcf2a86b02bea022047bd9fcb16d2b94ad068308d19b31cb00000000066aab5300ab529672aa8f01dbd8a205000000000663536353006a02e99901", "ac006351006a63ab63", 1, 119789359, "6629a1e75c6ae8f4f9d5f734246b6a71682a5ea57246040ef0584f6b97916175"],
                ["fe647f950311bf8f3a4d90afd7517df306e04a344d2b2a2fea368935faf11fa6882505890d0000000005ab5100516affffffff43c140947d9778718919c49c0535667fc6cc727f5876851cb8f7b6460710c7f60100000000ffffffffce4aa5d90d7ab93cbec2e9626a435afcf2a68dd693c15b0e1ece81a9fcbe025e0300000000ffffffff02f34806020000000002515262e54403000000000965635151ac655363636de5ce24", "6a005100ac516351", 2, 989643518, "818a7ceaf963f52b5c48a7f01681ac6653c26b63a9f491856f090d9d60f2ffe3"],
                ["a1050f8604d0f9d2feefcdb5051ae0052f38e21bf39daf583fd0c3900faa3eab5d431c0bbe030000000653536a005151683d27e5c6e0da8f22125823f32d5d98477d8098ef36263b9694d61d4d85d3f2ac02b7570200000007000052005165abffffffff0cad981542bcb54a87d9400aa63e514c7c6fab7158c2b1fb37821ea755eb162a0200000000b94feb5100e5ef3bf8ed8d43356c8a8d5ac6c7e80d7ff6040f4f0aa19abbe783f4f461240200000007636500000052655686fd70042be3ad02000000000465ab636a15680b000000000004acac53511277c705000000000452635252d27a0102000000000000000000", "6a6aacab65655251", 1, -982144648, "dfcf484111801989eb6df8dc2bafb944d7365ffeb36a575a08f3270d3ef24c9f"],
                ["cef7316804c3e77fe67fc6207a1ea6ae6eb06b3bf1b3a4010a45ae5c7ad677bb8a4ebd16d90200000009ac536a5152ac5263005301ab8a0da2b3e0654d31a30264f9356ba1851c820a403be2948d35cafc7f9fe67a06960300000006526a63636a53ffffffffbada0d85465199fa4232c6e4222df790470c5b7afd54704595a48eedd7a4916b030000000865ab63ac006a006ab28dba4ad55e58b5375053f78b8cdf4879f723ea4068aed3dd4138766cb4d80aab0aff3d0300000003ac6a00ffffffff010f5dd6010000000006ab006aab51ab00000000", "", 1, 889284257, "d0f32a6db43378af84b063a6706d614e2d647031cf066997c48c04de3b493a94"],
                ["7b3ff28004ba3c7590ed6e36f45453ebb3f16636fe716acb2418bb2963df596a50ed954d2e03000000065251515265abffffffff706ee16e32e22179400c9841013971645dabf63a3a6d2d5feb42f83aa468983e030000000653ac51ac5152ffffffffa03a16e5e5de65dfa848b9a64ee8bf8656cc1f96b06a15d35bd5f3d32629876e020000000043c1a3965448b3b46f0f0689f1368f3b2981208a368ec5c30defb35595ef9cf95ffd10e902000000036aac65253a5bbe042e907204000000000800006565656352634203b4020000000002656336b3b7010000000001ab7a063f0100000000026500a233cb76", "006551636a53ac5251", 1, -1144216171, "68c7bd717b399b1ee33a6562a916825a2fed3019cdf4920418bb72ffd7403c8c"],
                ["d5c1b16f0248c60a3ddccf7ebd1b3f260360bbdf2230577d1c236891a1993725e262e1b6cb000000000363636affffffff0a32362cfe68d25b243a015fc9aa172ea9c6b087c9e231474bb01824fd6bd8bc0300000005ab52ab516affffffff0420d9a70200000000045152656a45765d0000000000055252536a5277bad100000000000252ab3f3f3803000000000463acac5200000000", "52636a52ab65", 1, 1305123906, "978dc178ecd03d403b048213d904653979d11c51730381c96c4208e3ea24243a"],
                ["1be8ee5604a9937ebecffc832155d9ba7860d0ca451eaced58ca3688945a31d93420c27c460100000006abac5300535288b65458af2f17cbbf7c5fbcdcfb334ffd84c1510d5500dc7d25a43c36679b702e850f7c0200000003005300ffffffff7c237281cb859653eb5bb0a66dbb7aeb2ac11d99ba9ed0f12c766a8ae2a2157203000000086aabac526365acabfffffffff09d3d6639849f442a6a52ad10a5d0e4cb1f4a6b22a98a8f442f60280c9e5be80200000007ab00ab6565ab52ffffffff0398fe83030000000005526aababacbdd6ec010000000005535252ab6a82c1e6040000000001652b71c40c", "6563526353656351", 2, -853634888, "0d936cceda2f56c7bb87d90a7b508f6208577014ff280910a710580357df25f3"],
                ["9e0f99c504fbca858c209c6d9371ddd78985be1ab52845db0720af9ae5e2664d352f5037d4010000000552ac53636affffffff0e0ce866bc3f5b0a49748f597c18fa47a2483b8a94cef1d7295d9a5d36d31ae7030000000663515263ac635bb5d1698325164cdd3f7f3f7831635a3588f26d47cc30bf0fefd56cd87dc4e84f162ab702000000036a6365ffffffff85c2b1a61de4bcbd1d5332d5f59f338dd5e8accbc466fd860f96eef1f54c28ec030000000165ffffffff04f5cabd010000000007000052ac526563c18f1502000000000465510051dc9157050000000008655363ac525253ac506bb600000000000865656a53ab63006a00000000", "006a6a0052", 0, 1186324483, "2f9b7348600336512686e7271c53015d1cb096ab1a5e0bce49acd35bceb42bc8"],
                ["11ce51f90164b4b54b9278f0337d95c50d16f6828fcb641df9c7a041a2b274aa70b1250f2b0000000008ab6a6a65006551524c9fe7f604af44be050000000005525365006521f79a0300000000015306bb4e04000000000265ac99611a05000000000765acab656500006dc866d0", "", 0, -1710478768, "cfa4b7573559b3b199478880c8013fa713ca81ca8754a3fd68a6d7ee6147dc5a"],
                ["86bc233e02ba3c647e356558e7252481a7769491fb46e883dd547a4ce9898fc9a1ca1b77790000000006ab5351abab51f0c1d09c37696d5c7c257788f5dff5583f4700687bcb7d4acfb48521dc953659e325fa390300000003acac5280f29523027225af03000000000963abac0065ab65acab7e59d90400000000016549dac846", "53006aac52acac", 0, 711159875, "880330ccde00991503ea598a6dfd81135c6cda9d317820352781417f89134d85"],
                ["beac155d03a853bf18cd5c490bb2a245b3b2a501a3ce5967945b0bf388fec2ba9f04c03d68030000000012fe96283aec4d3aafed8f888b0f1534bd903f9cd1af86a7e64006a2fa0d2d30711af770010000000163ffffffffd963a19d19a292104b9021c535d3e302925543fb3b5ed39fb2124ee23a9db00302000000056500ac63acffffffff01ad67f503000000000300ac5189f78db2", "53536a636500", 2, 748992863, "bde3dd0575164d7ece3b5783ce0783ffddb7df98f178fe6468683230314f285a"],
                ["81dab34a039c9e225ba8ef421ec8e0e9d46b5172e892058a9ade579fe0eb239f7d9c97d45b0300000009ac65655351ab526363ffffffff10c0faaf7f597fc8b00bbc67c3fd4c6b70ca6b22718d15946bf6b032e62dae570000000005536a00ab6a02cddec3acf985bbe62c96fccf17012a87026ed63fc6756fa39e286eb4c2dd79b59d37400300000002516affffffff04f18b8d03000000000753abab5152636564411c02000000000400ab6300e965750300000000001bd2cf02000000000565ab526aab00000000", "006551ab", 0, -1488174485, "a3d65a8cd0c1eea8558d01396b929520a2221c29d9f25f29035b8abae874447f"],
                ["489ebbf10478e260ba88c0168bd7509a651b36aaee983e400c7063da39c93bf28100011f280100000004abab63ab2fc856f05f59b257a4445253e0d91b6dffe32302d520ac8e7f6f2467f7f6b4b65f2f59e903000000096353abacab6351656affffffff0122d9480db6c45a2c6fd68b7bc57246edffbf6330c39ccd36aa3aa45ec108fc030000000265ab9a7e78a69aadd6b030b12602dff0739bbc346b466c7c0129b34f50ae1f61e634e11e9f3d0000000006516a53525100ffffffff011271070000000000086563ab6353536352c4dd0e2c", "", 0, -293358504, "4eba3055bc2b58765593ec6e11775cea4b6493d8f785e28d01e2d5470ea71575"],
                ["6911195d04f449e8eade3bc49fd09b6fb4b7b7ec86529918b8593a9f6c34c2f2d301ec378b000000000263ab49162266af054643505b572c24ff6f8e4c920e601b23b3c42095881857d00caf56b28acd030000000565525200ac3ac4d24cb59ee8cfec0950312dcdcc14d1b360ab343e834004a5628d629642422f3c5acc02000000035100accf99b663e3c74787aba1272129a34130668a877cc6516bfb7574af9fa6d07f9b4197303400000000085351ab5152635252ffffffff042b3c95000000000000ff92330200000000046a5252ab884a2402000000000853530065520063000d78be03000000000953abab52ab53ac65aba72cb34b", "6a", 2, -637739405, "6b80d74eb0e7ee59d14f06f30ba7d72a48d3a8ff2d68d3b99e770dec23e9284f"],
                ["746347cf03faa548f4c0b9d2bd96504d2e780292730f690bf0475b188493fb67ca58dcca4f0000000002005336e3521bfb94c254058e852a32fc4cf50d99f9cc7215f7c632b251922104f638aa0b9d080100000008656aac5351635251ffffffff4da22a678bb5bb3ad1a29f97f6f7e5b5de11bb80bcf2f7bb96b67b9f1ac44d09030000000365ababffffffff036f02b30000000000076353ab6aac63ac50b72a050000000002acaba8abf804000000000663006a6a6353797eb999", "acac5100", 1, -1484493812, "164c32a263f357e385bd744619b91c3f9e3ce6c256d6a827d6defcbdff38fa75"],
                ["e17149010239dd33f847bf1f57896db60e955117d8cf013e7553fae6baa9acd3d0f1412ad90200000006516500516500cb7b32a8a67d58dddfb6ceb5897e75ef1c1ff812d8cd73875856487826dec4a4e2d2422a0100000004ac525365196dbb69039229270400000000070000535351636a8b7596020000000006ab51ac52655131e99d040000000003516551ee437f5c", "ac656a53", 1, 1102662601, "8858bb47a042243f369f27d9ab4a9cd6216adeac1c1ac413ed0890e46f23d3f3"],
                ["144971940223597a2d1dec49c7d4ec557e4f4bd207428618bafa3c96c411752d494249e1fb0100000004526a5151ffffffff340a545b1080d4f7e2225ff1c9831f283a7d4ca4d3d0a29d12e07d86d6826f7f0200000003006553ffffffff03c36965000000000000dfa9af00000000000451636aac7f7d140300000000016300000000", "", 1, -108117779, "c84fcaf9d779df736a26cc3cabd04d0e61150d4d5472dd5358d6626e610be57f"],
                ["b11b6752044e650b9c4744fb9c930819227d2ac4040d8c91a133080e090b042a142e93906e0000000003650053ffffffff6b9ce7e29550d3c1676b702e5e1537567354b002c8b7bb3d3535e63ad03b50ea01000000055100516300fffffffffcf7b252fea3ad5a108af3640a9bc2cd724a7a3ce22a760fba95496e88e2f2e801000000036a00ac7c58df5efba193d33d9549547f6ca839f93e14fa0e111f780c28c60cc938f785b363941b000000000863ab51516552ac5265e51fcd0308e9830400000000036a00abab72190300000000016a63d0710000000000050051ab6a6300000000", "53005165ac51ab65", 0, 229563932, "e562579d1a2b10d1c5e45c06513456002a6bec157d7eb42511d30b118103c052"],
                ["2aee6b9a02172a8288e02fac654520c9dd9ab93cf514d73163701f4788b4caeeb9297d2e250300000004ab6363008fb36695528d7482710ea2926412f877a3b20acae31e9d3091406bfa6b62ebf9d9d2a6470100000009535165536a63520065ffffffff03f7b560050000000003acab6a9a8338050000000000206ce90000000000056552516a5100000000", "5252", 1, -1102319963, "fa4676c374ae3a417124b4c970d1ed3319dc3ac91fb36efca1aa9ed981a8aa1b"],
                ["9554595203ad5d687f34474685425c1919e3d2cd05cf2dac89d5f33cd3963e5bb43f8706480100000000ffffffff9de2539c2fe3000d59afbd376cb46cefa8bd01dbc43938ff6089b63d68acdc2b02000000096553655251536a6500fffffffff9695e4016cd4dfeb5f7dadf00968e6a409ef048f81922cec231efed4ac78f5d010000000763abab6a5365006caaf0070162cc640200000000045163ab5100000000", "", 0, -1105256289, "e8e10ed162b1a43bfd23bd06b74a6c2f138b8dc1ab094ffb2fa11d5b22869bee"],
                ["04f51f2a0484cba53d63de1cb0efdcb222999cdf2dd9d19b3542a896ca96e23a643dfc45f00200000007acac53510063002b091fd0bfc0cfb386edf7b9e694f1927d7a3cf4e1d2ce937c1e01610313729ef6419ae7030000000165a3372a913c59b8b3da458335dc1714805c0db98992fd0d93f16a7f28c55dc747fe66a5b503000000095351ab65ab52536351ffffffff5650b318b3e236802a4e41ed9bc0a19c32b7aa3f9b2cda1178f84499963a0cde000000000165ffffffff0383954f04000000000553ac536363a8fc90030000000000a2e315000000000005acab00ab5100000000", "0053", 2, -1424653648, "a5bc0356f56b2b41a2314ec05bee7b91ef57f1074bcd2efc4da442222269d1a3"],
                ["5e4fab42024a27f0544fe11abc781f46596f75086730be9d16ce948b04cc36f86db7ad50fd01000000026a00613330f4916285b5305cc2d3de6f0293946aa6362fc087727e5203e558c676b314ef8dd401000000001af590d202ba496f040000000001009e3c9604000000000351ac51943d64d3", "51acabab5100ab52", 1, -129301207, "556c3f90aa81f9b4df5b92a23399fe6432cf8fecf7bba66fd8fdb0246440036c"],
                ["a115284704b88b45a5f060af429a3a8eab10b26b7c15ed421258f5320fa22f4882817d6c2b0300000003005300ffffffff4162f4d738e973e5d26991452769b2e1be4b2b5b7e8cbeab79b9cf9df2882c040000000006636aac63ac5194abc8aa22f8ddc8a7ab102a58e39671683d1891799d19bd1308d24ea6d365e571172f1e030000000700515352515153ffffffff4da7ad75ce6d8541acbb0226e9818a1784e9c97c54b7d1ff82f791df1c6578f60000000000ffffffff01b1f265040000000009ab0051ac656a516a5300000000", "51abab6352535265", 0, -1269106800, "0ef7b6e87c782fa33fe109aab157a2d9cddc4472864f629510a1c92fa1fe7fc1"],
                ["f3f771ae02939752bfe309d6c652c0d271b7cab14107e98032f269d92b2a8c8853ab057da8010000000563ab6a6365670c305c38f458e30a7c0ab45ee9abd9a8dc03bae1860f965ffced879cb2e5d0bb156821020000000153ffffffff025dc619050000000002ac51ec0d250100000000076a5200636a6363333aecd8", "650053ac515100ab", 1, 1812404608, "a7aa34bf8a5644f03c6dd8801f9b15ba2e07e07256dbf1e02dad59f0d3e17ea9"],
                ["fd3e267203ae7d6d3975e738ca84f12540229bb237dd228d5f688e9d5ba53fce4302b0334d01000000026353ffffffff602a3ab75af7aa951d93093e345ef0037a2863f3f580a9b1a575fffe68e677450300000000239e476d1e8f81e8b6313880d8a49b27c1b00af467f29756e76f675f084a5676539636ab030000000765ab6351acac52d9217747044d773204000000000752ac51526353acc33e45050000000005516500005115d889040000000004ab5163510cbbbd0200000000016500000000", "65ac526aac6a53ab52", 2, -886179388, "bc46f3f83058ddf5bebd9e1f2c117a673847c4dc5e31cfb24bac91adf30877cf"],
                ["f380ae23033646af5dfc186f6599098015139e961919aea28502ea2d69474413d94a555ea2000000000853635265abacac5314da394b99b07733341ddba9e86022637be3b76492992fb0f58f23c915098979250a96620300000003ab6300ffffffff4bb6d1c0a0d84eac7f770d3ad0fdc5369ae42a21bbe4c06e0b5060d5990776220300000000ffffffff0486fd70020000000007ac6500635252acf3fd72010000000005656a6a6551212de90500000000096365006a63635153000fa33100000000000600535151656300000000", "ab52", 2, -740890152, "f804fc4d81f039009ed1f2cccb5c91da797543f235ac71b214c20e763a6d86d7"],
                ["5c45d09801bb4d8e7679d857b86b97697472d514f8b76d862460e7421e8617b15a2df217c6010000000863acacab6565006affffffff01156dbc03000000000952ac63516551ac6aac00000000", "6aabac", 0, 1310125891, "270445ab77258ced2e5e22a6d0d8c36ac7c30fff9beefa4b3e981867b03fa0ad"],
                ["4ecc6bde030ca0f83c0ed3d4b777f94c0c88708c6c933fe1df6874f296d425cac95355c23d0000000006ac6a51536a52f286a0969d6170e20f2a8000193807f5bc556770e9d82341ef8e17b0035eace89c76edd50200000007ac65525100656affffffff5bade6e462fac1927f078d69d3a981f5b4c1e59311a38efcb9a910aa436afaa80000000007ac6a006352ab52ffffffff0331e58902000000000763ac53636352abb8b3ca000000000001637a1d26040000000009535263ac6a5352ab655ae34a39", "6a65ab", 2, 2142728517, "4a3415eb1677ae4e0c939644a4cfd5dc6299780b55cd0dc735967057b6b1526a"],
                ["a59484b501eb50114be0fc79e72ab9bc9f4a5f7acdf274a56d6b68684eb68cf8b07ec5d1c2000000000765abab00ab00639e09aa940141e3530200000000046500ac6500000000", "00516565ab", 0, -1561622405, "d60bbadd2cc0674100baa08d0e0493ee4248f0304b3eb778da942041f503a896"],
                ["53dc1a88046531c7b57a35f4d9adf101d068bf8d63fbbedaf4741dba8bc5e92c8725def571030000000453655251fcdf116a226b3ec240739c4c7493800e4edfe67275234e371a227721eac43d3d9ecaf1b50300000003ac0052ffffffff2c9279ffeea4718d167e9499bd067600715c14484e373ef93ae4a31d2f5671ab0000000009516553ac636a6a65001977752eeba95a8f16b88c571a459c2f2a204e23d48cc7090e4f4cc35846ca7fc0a455ce00000000055165ac0063188143f80205972902000000000765ac63ac516353c7b6a50000000000036a510000000000", "655351536a", 0, 103806788, "b276584d3514e5b4e058167c41dc02915b9d97f6795936a51f40e894ed8508bc"],
                ["53f8959f01ddb36afdcd20167edcbb75a63d18654fdcf10bc0004c761ab450fe236d79cb2702000000065151650063653435003a033a5e34050000000009ac52516a630000516ab86db3030000000002006344ac090500000000046363ab00f3644537", "5263abab63ac656353", 0, -218513553, "f1f2a489682e42a6fc20025dfc89584d17f150b2d7ae3ddedd2bf43d5e24f37f"],
                ["5a06cb4602dcfc85f49b8d14513f33c48f67146f2ee44959bbca092788e6823b2719f3160b0200000001ab3c013f2518035b9ea635f9a1c74ec1a3fb7496a160f46aae2e09bfc5cd5111a0f20969e003000000015158c89ab7049f20d6010000000008ac6a52abac53515349765e00000000000300ab638292630100000000045351ab0086da09010000000006656a6365525300000000", "526a63", 1, 1502936586, "bdfaff8a4e775379c5dc26e024968efa805f923de53fa8272dd53ec582afa0c5"],
                ["ca9d84fa0129011e1bf27d7cb71819650b59fb292b053d625c6f02b0339249b498ff7fd4b601000000025352ffffffff032173a0040000000008525253abab5152639473bb030000000009005153526a53535151d085bd0000000000086a5365ab5165655300000000", "005152ac51", 0, 580353445, "c629d93b02037f40aa110e46d903edb34107f64806aa0c418d435926feef68b8"],
                ["e3cdbfb4014d90ae6a4401e85f7ac717adc2c035858bf6ff48979dd399d155bce1f150daea0300000002ac51a67a0d39017f6c71040000000005535200535200000000", "", 0, -1899950911, "c1c7df8206e661d593f6455db1d61a364a249407f88e99ecad05346e495b38d7"],
                ["b2b6b9ab0283d9d73eeae3d847f41439cd88279c166aa805e44f8243adeb3b09e584efb1df00000000026300ffffffff7dfe653bd67ca094f8dab51007c6adaced09de2af745e175b9714ca1f5c68d050000000003ac6500aa8e596903fd3f3204000000000553ac6a6a533a2e210500000000075253acabab526392d0ee020000000008520065635200ab5200000000", "65acacac65005365", 0, 28298553, "39c2aaa2496212b3ab120ab7d7f37c5e852bfe38d20f5226413a2268663eeae8"],
                ["f30c5c3d01a6edb9e10fafaf7e85db14e7fec558b9dca4a80b05d7c3a2944d282c5018f4680200000003005263ffffffff04aac3530300000000026551bc2419010000000009005163acab6a5100658e7085050000000000c5e4ec050000000007656a6a635365ab2d8e8882", "abac53ab005251ac52", 0, -490287546, "877e347ec7487497769e2581142276d1a8d813b652e4483cf9cc993d16354417"],
                ["4314339e01de40faabcb1b970245a7f19eedbc17c507dac86cf986c2973715035cf95736ae0200000007abababababab65bde67b900151510b04000000000853ac00655200535300000000", "52", 0, 399070095, "47585dc25469d04ff3a60939d0a03779e3e81a411bf0ca18b91bb925ebd30718"],
                ["2d4cf4e9031b3e175b2ff18cd933151379d9cfac4713d8bd0e63b70bd4a92277aa7af901ab000000000565515353abffffffff557666c7f3be9cdecdad44c3df206eb63a2da4ed1f159d21193882a9f0340081020000000963ab53ab5252ac63abffffffff8a8c897bdb87e93886aad5ded9d82a13101d5476554386373646ca5e23612e450300000009006a526552abab6a635ac03fc00198bb02040000000009525100526a6563636a1d052834", "ab52ac00acac6a", 0, -1469882480, "09ed6563a454814ab7e3b4c28d56d8751162b77df1825b37ba66c6147750b2a3"],
                ["f063171b03e1830fdc1d685a30a377537363ccafdc68b42bf2e3acb908dac61ee24b37595c020000000765ac5100ab6aacf447bc8e037b89d6cadd62d960cc442d5ced901d188867b5122b42a862929ce45e7b628d010000000253aba009a1ba42b00f1490b0b857052820976c675f335491cda838fb7934d5eea0257684a2a202000000001e83cf2401a7f777030000000008ab6553526a53526a00000000", "", 2, 1984790332, "c19caada8e71535e29a86fa29cfd9b74a0c7412003fc722a121005e461e01636"],
                ["cf7bdc250249e22cbe23baf6b648328d31773ea0e771b3b76a48b4748d7fbd390e88a004d30000000003ac536a4ab8cce0e097136c90b2037f231b7fde2063017facd40ed4e5896da7ad00e9c71dd70ae600000000096a0063516352525365ffffffff01b71e3e00000000000300536a00000000", "", 1, 546970113, "6a815ba155270af102322c882f26d22da11c5330a751f520807936b320b9af5d"],
                ["ac7a125a0269d35f5dbdab9948c48674616e7507413cd10e1acebeaf85b369cd8c88301b7c030000000963656aac6a530053abffffffffed94c39a582e1a46ce4c6bffda2ccdb16cda485f3a0d94b06206066da12aecfe010000000752abab63536363ef71dcfb02ee07fa0400000000016a6908c802000000000751656a6551abac688c2c2d", "6a6351526551", 0, 858400684, "552ff97d7924f51cda6d1b94be53483153ef725cc0a3a107adbef220c753f9a6"],
                ["3a1f454a03a4591e46cf1f7605a3a130b631bf4dfd81bd2443dc4fac1e0a224e74112884fe0000000005516aac6a53a87e78b55548601ffc941f91d75eab263aa79cd498c88c37fdf275a64feff89fc1710efe03000000016a39d7ef6f2a52c00378b4f8f8301853b61c54792c0f1c4e2cd18a08cb97a7668caa008d970200000002656affffffff017642b20100000000096a63535253abac6a6528271998", "51", 2, 1459585400, "e9a7f21fc2d38be7be47095fbc8f1bf8923660aa4d71df6d797ae0ba5ca4d5b0"],
                ["f59366cc0114c2a18e6bd1347ed9470f2522284e9e835dd5c5f7ef243639ebea95d9b232b6020000000153474b62eb045c00170500000000096352ab516352ab5200038a520400000000086aab5253656a63005b968904000000000963536353ac0053635387106002000000000000000000", "ab52526300ab51", 0, 1834116153, "cdf51f6e3a9dc2be5a59ea4c00f5aac1e1426a5202c325e6cf2567d07d8d8de4"],
                ["6269e0fa0173e76e89657ca495913f1b86af5b8f1c1586bcd6c960aede9bc759718dfd5044000000000352ac530e2c7bd90219849b000000000007ab00ab6a53006319f281000000000007ab00515165ac5200000000", "6a", 0, -2039568300, "62094f98234a05bf1b9c7078c5275ed085656856fb5bdfd1b48090e86b53dd85"],
                ["eb2bc00604815b9ced1c604960d54beea4a3a74b5c0035d4a8b6bfec5d0c9108f143c0e99a0000000000ffffffff22645b6e8da5f11d90e5130fd0a0df8cf79829b2647957471d881c2372c527d8010000000263acffffffff1179dbaf17404109f706ae27ad7ba61e860346f63f0c81cb235d2b05d14f2c1003000000025300264cb23aaffdc4d6fa8ec0bb94eff3a2e50a83418a8e9473a16aaa4ef8b855625ed77ef40100000003ac51acf8414ad404dd328901000000000652526500006ab6261c000000000002526a72a4c9020000000006ac526500656586d2e7000000000006656aac00ac5279cd8908", "51", 1, -399279379, "d37532e7b2b8e7db5c7c534197600397ebcc15a750e3af07a3e2d2e4f84b024f"],
                ["dc9fe6a8038b84209bbdae5d848e8c040433237f415437592907aa798bf30d9dbbddf0ff85010000000153ffffffff23269a7ea29fcf788db483b8d4c4b35669e582608644259e950ce152b0fa6e050000000003acababffffffff65de94857897ae9ea3aa0b938ba6e5adf374d48469922d2b36dbb83d3b8c8261010000000452ac5200ffffffff02856e9b0300000000026a51980c8e02000000000365ab63d2648db4", "00ab0051ac526565", 2, 1562581941, "5cef9d8e18a2d5a70448f17b465d411a19dab78f0ddf1672ffd518b188f52433"],
                ["eba8b0de04ac276293c272d0d3636e81400b1aaa60db5f11561480592f99e6f6fa13ad387002000000070053acab536563bebb23d66fd17d98271b182019864a90e60a54f5a615e40b643a54f8408fa8512cfac927030000000963ac6a6aabac65ababffffffff890a72192bc01255058314f376bab1dc72b5fea104c154a15d6faee75dfa5dba020000000100592b3559b0085387ac7575c05b29b1f35d9a2c26a0c27903cc0f43e7e6e37d5a60d8305a030000000252abffffffff0126518f05000000000000000000", "005300635252635351", 1, 664344756, "26dc2cba4bd5334e5c0b3a520b44cc1640c6b923d10e576062f1197171724097"],
                ["91bd040802c92f6fe97411b159df2cd60fb9571764b001f31657f2d616964637605875c2a901000000055263006a65ffffffff3651df372645f50cf4e32fdf6e61c766e912e16335db2b40c5d52fe89eefe7cd00000000040065ab65ffffffff03ca8625030000000009ab51ac63530052ab52c6bf14020000000006ab00ab52005167d270000000000007ab53525351636a00000000", "5151ab63005252ac", 1, 1983087664, "3e5aa0200248d8d86ede3b315ca1b857018b89184a4bd023bd88ab12e499f6e1"],
                ["185cda1a01ecf7a8a8c28466725b60431545fc7a3367ab68e34d486e8ea85ee3128e0d8384000000000465ac63abec88b7bb031c56eb04000000000965636a51005252006a7c78d5040000000007acac63abac51ac3024a40500000000086300526a51abac51464c0e8c", "0065535265515352", 0, 1594558917, "b5280b9610c0625a65b36a8c2402a95019a7bbb9dd3de77f7c3cb1d82c3263ba"],
                ["a9531f07034091668b65fea8b1a79700d586ac9e2f42ca0455a26abe41f9e1805d009a0f5702000000096365516365ac5263ab3619bac643a9e28ee47855118cf80c3a74531cdf198835d206d0fe41804e325a4f9f105e03000000016a58e3ab0d46375d98994daf0fa7c600d2bb4669e726fca0e3a3f21ea0d9e777396740328f0100000008636a5363ab526a538d3ea7700304cb66030000000007515163ab52ab510184030500000000085353636565ac0051d9cff402000000000751ab52ab5352abf0e36254", "ab5353ac5365acab", 2, 1633101834, "04c9ef72f33668ca449c0415becf62cc0b8e0c75f9c8813852d42a58acf107c8"],
                ["6b5ecc7903fe0ba37ea551df92a59e12bad0a3065846ba69179a8f4a741a2b4fcf679aac810200000004535263529a3d343293b99ab425e7ef8529549d84f480bcd92472bab972ea380a302128ae14dfcd0200000000025163ffffffff24636e4545cab9bf87009119b7fc3ec4d5ee9e206b90f35d1df8a563b6cd097a010000000852abac53005153abc64467860406e832020000000009526300006a53ac6352ac1395010000000002ac53b117f300000000000863655351acab00651edf02030000000008ab51ac6353535252628ef71d", "ab63ab6a52ac526563", 2, -1559697626, "8f07ece7d65e509f1e0780584ef8d271c1c61a13b10335d5faafc7afc8b5b8ec"],
                ["92c9fb780138abc472e589d5b59489303f234acc838ca66ffcdf0164517a8679bb622a4267020000000153468e373d04de03fa020000000009ac006a5265ab5163006af649050000000007515153006a00658ceb59030000000001ac36afa0020000000009ab53006351ab51000000000000", "6a", 0, 2059357502, "e2358dfb51831ee81d7b0bc602a65287d6cd2dbfacf55106e2bf597e22a4b573"],
                ["6f62138301436f33a00b84a26a0457ccbfc0f82403288b9cbae39986b34357cb2ff9b889b302000000045253655335a7ff6701bac9960400000000086552ab656352635200000000", "6aac51", 0, 1444414211, "502a2435fd02898d2ff3ab08a3c19078414b32ec9b73d64a944834efc9dae10c"],
                ["9981143a040a88c2484ac3abe053849e72d04862120f424f373753161997dd40505dcb4783030000000700536365536565a2e10da3f4b1c1ad049d97b33f0ae0ea48c5d7c30cc8810e144ad93be97789706a5ead180100000003636a00ffffffffbdcbac84c4bcc87f03d0ad83fbe13b369d7e42ddb3aecf40870a37e814ad8bb5010000000963536a5100636a53abffffffff883609905a80e34202101544f69b58a0b4576fb7391e12a769f890eef90ffb72020000000651656352526affffffff04243660000000000004ab5352534a9ce001000000000863656363ab6a53652df19d030000000003ac65acedc51700000000000000000000", "ac6300acac", 2, 293672388, "7ba99b289c04718a7283f150d831175ed6303081e191a0608ea81f78926c5bdf"],
                ["a2bb630b01989bc5d643f2da4fb9b55c0cdf846ba06d1dbe372893024dbbe5b9b8a1900af802000000055265ac63aca7a68d2f04916c74010000000003abac007077f0040000000001007d4127010000000005ac516aac000f31e8030000000000571079c9", "65ab0051ac", 0, -1103627693, "92d53b4390262e6b288e8a32e0cfc36cd5adfdfabfe96c7bfd4a19d65e233761"],
                ["49f7d0b6037bba276e910ad3cd74966c7b3bc197ffbcfefd6108d6587006947e97789835ea0300000008526a52006a650053ffffffff8d7b6c07cd10f4c4010eac7946f61aff7fb5f3920bdf3467e939e58a1d4100ab03000000076aac63ac535351ffffffff8f48c3ba2d52ad67fbcdc90d8778f3c8a3894e3c35b9730562d7176b81af23c80100000003ab5265ffffffff0301e3ef0300000000046a525353e899ac0500000000075153ab6a65abac259bea0400000000007b739972", "53516aacac6aac", 1, 955403557, "5d366a7f4346ae18aeb7c9fc4dab5af71173184aa20ed22fcb4ea8511ad25449"],
                ["58a4fed801fbd8d92db9dfcb2e26b6ff10b120204243fee954d7dcb3b4b9b53380e7bb8fb60100000003006351ffffffff02a0795b050000000006536351ac6aac2718d00200000000075151acabac515354d21ba1", "005363515351", 0, -1322430665, "bbee941bbad950424bf40e3623457db47f60ed29deaa43c99dec702317cb3326"],
                ["32765a0b02e455793d9ce530e9f6a44bcbc612e893a875b5da61d822dc56d8245166c398b403000000085353abac6300006a6bdee2a78d0d0b6a5ea666eed70b9bfea99d1d612ba3878f615c4da10d4a521cba27155002000000035363abffffffff043cd42401000000000551656a53653685320100000000030000511881bc0500000000065165abab636a20169f010000000007acab656aac63acdb0706a8", "65ac53ab53", 0, 1936499176, "5c5a9c3a5de7dc7a82bc171c9d3505913b8bcc450bc8b2d11772c1a1d781210b"],
                ["17fad0d303da0d764fedf9f2887a91ea625331b28704940f41e39adf3903d8e75683ef6d46020000000151ffffffffff376eea4e880bcf0f03d33999104aafed2b3daf4907950bb06496af6b51720a020000000900636a63525253525196521684f3b08497bad2c660b00b43a6a517edc58217876eb5e478aa3b5fda0f29ee1bea00000000046aacab6affffffff03dde8e2050000000007ac5365ac51516a14772e000000000005630000abacbbb360010000000006ab5251ab656a50f180f0", "0053", 0, -1043701251, "a3bdf8771c8990971bff9b4e7d59b7829b067ed0b8d3ac1ec203429811384668"],
                ["236c32850300045e292c84ede2b9ab5733ba08315a2bb09ab234c4b4e8894808edbdac0d3b020000000653635363abacffffffffd3f696bb31fdd18a72f3fc2bb9ae54b416a253fc37c1a0f0180b52d35bad49440100000004650053abffffffffa85c75a2406d82a93b12e555b66641c1896a4e83ae41ef1038218311e38ace060200000006abab006a51ac104b5e6701e2842c04000000000800630051ac0000ab00000000", "ab63ac6a516a", 1, -1709887524, "8c29ea8ef60c5a927fccdba8ea385db6b6b84d98e891db45f5d4ee3148d3f5a7"],
                ["b78d5fd601345f3100af494cdf447e7d4076179f940035b0ebe8962587d4d0c9c6c9fc34ee0300000003516a6affffffff03dc5c890100000000085353ac53ac6a52534ac941040000000007ac63656a51ab51d4266b0100000000036aacac70731f2d", "005351ab0053", 0, -1789071265, "d5f1c1cb35956a5711d67bfb4cedbc67e77c089b912d688ad440ff735adb390d"],
                ["5a2257df03554550b774e677f348939b37f8e765a212e566ce6b60b4ea8fed4c9504b7f7d1000000000653655265ab5258b67bb931df15b041177cf9599b0604160b79e30f3d7a594e7826bae2c29700f6d8f8f40300000005515300ac6a159cf8808a41f504eb5c2e0e8a9279f3801a5b5d7bc6a70515fbf1c5edc875bb4c9ffac500000000050063510052ffffffff0422a90105000000000965006a650000516a006417d2020000000006526363ab00524d969d0100000000035153acc4f077040000000005ac5200636500000000", "6a52", 1, -1482463464, "37b794b05d0687c9b93d5917ab068f6b2f0e38406ff04e7154d104fc1fb14cdc"],
                ["e0032ad601269154b3fa72d3888a3151da0aed32fb2e1a15b3ae7bee57c3ddcffff76a1321010000000100110d93ae03f5bd080100000000075263516a6551002871e60100000000046a005252eaa753040000000004ab6aab526e325c71", "630052", 0, -1857873018, "ea117348e94de86381bb8ad1c7f93b8c623f0272104341701bb54e6cb433596c"],
                ["014b2a5304d46764817aca180dca50f5ab25f2e0d5749f21bb74a2f8bf6b8b7b3fa8189cb7030000000965ac5165ab6a51ac6360ecd91e8abc7e700a4c36c1a708a494c94bb20cbe695c408543146566ab22be43beae9103000000045163ab00ffffffffffa48066012829629a9ec06ccd4905a05df0e2b745b966f6a269c9c8e13451fc00000000026565ffffffffc40ccadc21e65fe8a4b1e072f4994738ccaf4881ae6fede2a2844d7da4d199ab02000000065152ab536aabffffffff01b6e054030000000004515352ab3e063432", "", 0, 1056459916, "a7aff48f3b8aeb7a4bfe2e6017c80a84168487a69b69e46681e0d0d8e63a84b6"],
                ["c4ef04c103c5dde65410fced19bf6a569549ecf01ceb0db4867db11f2a3a3eef0320c9e8e001000000085100536a53516aabffffffff2a0354fa5bd96f1e28835ffe30f52e19bd7d5150c687d255021a6bec03cf4cfd03000000056a006300514900c5b01d3d4ae1b97370ff1155b9dd0510e198d266c356d6168109c54c11b4c283dca00300000002ababffffffff02e19e3003000000000451655351fa5c0003000000000163ef1fc64b", "51636a51ab630065", 1, -1754709177, "0a281172d306b6a32e166e6fb2a2cc52c505c5d60ea448e9ba7029aa0a2211e1"],
                ["29083fe00398bd2bb76ceb178f22c51b49b5c029336a51357442ed1bac35b67e1ae6fdf13100000000066a6500acab51ffffffffe4ca45c9dc84fd2c9c47c7281575c2ba4bf33b0b45c7eca8a2a483f9e3ebe4b3010000000200abffffffffdf47ad2b8c263fafb1e3908158b18146357c3a6e0832f718cd464518a219d18303000000096352ac656351ac0052daddfb3b0231c36f00000000000400526a5275c7e0020000000001ab00000000", "acab536aac52", 2, 300802386, "82ebc07b16cff0077e9c1a279373185b3494e39d08fd3194aae6a4a019377509"],
                ["1201ab5d04f89f07c0077abd009762e59db4bb0d86048383ba9e1dad2c9c2ad96ef660e6d00200000007ab6a65ac5200652466fa5143ab13d55886b6cdc3d0f226f47ec1c3020c1c6e32602cd3428aceab544ef43e00000000086a6a6a526a6a5263ffffffffd5be0b0be13ab75001243749c839d779716f46687e2e9978bd6c9e2fe457ee48020000000365abab1e1bac0f72005cf638f71a3df2e3bbc0fa35bf00f32d9c7dc9c39a5e8909f7d53170c8ae0200000008ab6a51516363516affffffff02f0a6210500000000036300ac867356010000000009acab65ac6353536a659356d367", "ac53535252", 0, 917543338, "418acc156c2bc76a5d7baa58db29f1b4cf6c266c9222ed167ef5b4d47f0e0f41"],
                ["344fa11e01c19c4dd232c77742f0dd0aeb3695f18f76da627628741d0ee362b0ea1fb3a2180200000007635151005100529bab25af01937c1f0500000000055153ab53656e7630af", "6351005163ac51", 0, -629732125, "228ca52a0a376fe0527a61cfa8da6d7baf87486bba92d49dfd3899cac8a1034f"],
                ["b2fda1950191358a2b855f5626a0ebc830ab625bea7480f09f9cd3b388102e35c0f303124c030000000565ac65ab53ffffffff03f9c5ec04000000000765ab51516551650e2b9f0500000000045365525284e8f6040000000001ac00000000", "ac51655253", 0, 1433027632, "d2fa7e13c34cecda5105156bd2424c9b84ee0a07162642b0706f83243ff811a8"],
                ["a4a6bbd201aa5d882957ac94f2c74d4747ae32d69fdc765add4acc2b68abd1bdb8ee333d6e0300000008516a6552515152abffffffff02c353cb040000000007ac6351ab51536588bd320500000000066552525253ac00000000", "", 0, 1702060459, "499da7d74032388f820645191ac3c8d20f9dba8e8ded7fa3a5401ea2942392a1"],
                ["584e8d6c035a6b2f9dac2791b980a485994bf38e876d9dda9b77ad156eee02fa39e19224a60300000003ab636529db326cc8686a339b79ab6b6e82794a18e0aabc19d9ad13f31dee9d7aad8eff38288588020000000452530052ffffffff09a41f07755c16cea1c7e193c765807d18cadddca6ec1c2ed7f5dcdca99e90e80000000001acffffffff01cba62305000000000451ac63acccdf1f67", "ab536a6363", 2, -27393461, "1125645b49202dca2df2d76dae51877387903a096a9d3f66b5ac80e042c95788"],
                ["83a583d204d926f2ee587a83dd526cf1e25a44bb668e45370798f91a2907d184f7cddcbbc7030000000700ab6565536a539f71d3776300dffdfa0cdd1c3784c9a1f773e34041ca400193612341a9c42df64e3f550e01000000050052515251ffffffff52dab2034ab0648553a1bb8fc4e924b2c89ed97c18dfc8a63e248b454035564b01000000015139ab54708c7d4d2c2886290f08a5221cf69592a810fd1979d7b63d35c271961e710424fd0300000005ac65ac5251ffffffff01168f7c030000000000a85e5fb0", "6a536353656a00", 0, 179595345, "5350a31ac954a0b49931239d0ecafbf34d035a537fd0c545816b8fdc355e9961"],
                ["ffd35d51042f290108fcb6ea49a560ba0a6560f9181da7453a55dfdbdfe672dc800b39e7320200000006630065516a65f2166db2e3827f44457e86dddfd27a8af3a19074e216348daa0204717d61825f198ec0030100000006ab51abab00abffffffffdf41807adb7dff7db9f14d95fd6dc4e65f8402c002d009a3f1ddedf6f4895fc8030000000500ab006a65a5a848345052f860620abd5fcd074195548ce3bd0839fa9ad8642ed80627bf43a0d47dbd010000000765ab006a656a53b38cdd6502a186da05000000000765ab00ab006a53527c0e0100000000085365ab51acacac52534bd1b1", "6a635253ac0000", 0, 1095082149, "3c05473a816621a3613f0e903faa1a1e44891dd40862b029e41fc520776350fa"],
                ["6c9a4b98013c8f1cae1b1df9f0f2de518d0c50206a0ab871603ac682155504c0e0ce946f460100000000ffffffff04e9266305000000000753535100ac6aacded39e04000000000365ac6ab93ccd010000000002515397bf3d050000000003ab636300000000", "63520052ac656353", 0, -352633155, "936eff8cdfd771be24124da87c7b24feb48da7cbc2c25fb5ba13d1a23255d902"],
                ["e01dc7f0021dc07928906b2946ca3e9ac95f14ad4026887101e2d722c26982c27dc2b59fdb0000000005ac5200516ab5a31ffadcbe74957a5a3f97d7f1475cc6423fc6dbc4f96471bd44c70cc736e7dec0d1ea020000000951636a526a52abac53ffffffff04bc2edd05000000000252ab528c7b02000000000952ac51526500525353324820040000000002005380c713000000000009630065ab00ac525252451bbb48", "53ab65ac", 0, -552384418, "69c0b30f4c630a6c878fde6ea6b74dae94f4eb3bcfbde2dc3649e1a9ada00757"],
                ["009046a1023f266d0113556d604931374d7932b4d6a7952d08fbd9c9b87cbd83f4f4c178b4030000000452ac526346e73b438c4516c60edd5488023131f07acb5f9ea1540b3e84de92f4e3c432289781ea4900000000046500655357dfd6da02baef910100000000026a007d101703000000000800516500abacac5100000000", "6aab6553ac", 0, -802456605, "f8757fbb4448ca34e0cd41b997685b37238d331e70316659a9cc9087d116169d"],
                ["df76ec0801a3fcf3d18862c5f686b878266dd5083f16cf655facab888b4cb3123b3ce5db7e01000000010010e7ac6a0233c83803000000000365ac51faf14a040000000004ac51655100000000", "6353acab", 0, 15705861, "e7d873aa079a19ec712b269a37d2670f60d8cb334c4f97e2e3fd10eeb8ee5f5e"],
                ["828fd3e0031084051ccef9cfdd97fae4d9cc50c0dae36bd22a3ff332881f17e9756c3e288e0200000004ab535363961a2ccccaf0218ec6a16ba0c1d8b5e93cfd025c95b6e72bc629ec0a3f47da7a4c396dad01000000025353ffffffff19ad28747fb32b4caf7b5dbd9b2da5a264bedb6c86d3a4805cd294ae53a86ac40200000009ab53535351ab6551abffffffff04a41650030000000005656aab6aab8331a304000000000700516365ac516a0d2a47010000000007abac516353abacdebc19040000000006ab5300636a6300000000", "51ab52ab53ac52", 0, 1866105980, "311094b4d73e31aefc77e97859ef07ca2f07a7b7e4d7def80c69d3f5d58527e5"],
                ["c4b80f850323022205b3e1582f1ed097911a81be593471a8dce93d5c3a7bded92ef6c7c1260100000002006affffffff70294d62f37c3da7c5eae5d67dce6e1b28fedd7316d03f4f48e1829f78a88ae801000000096a5200530000516351f6b7b544f7c39189d3a2106ca58ce4130605328ce7795204be592a90acd81bef517d6f170200000000ffffffff012ab8080000000000075100006365006335454c1e", "53ac6a536aacac", 0, -1124103895, "06277201504e6bf8b8c94136fad81b6e3dadacb9d4a2c21a8e10017bfa929e0e"],
                ["8ab69ed50351b47b6e04ac05e12320984a63801716739ed7a940b3429c9c9fed44d3398ad40300000006536a516a52638171ef3a46a2adb8025a4884b453889bc457d63499971307a7e834b0e76eec69c943038a0300000000ffffffff566bb96f94904ed8d43d9d44a4a6301073cef2c011bf5a12a89bedbaa03e4724030000000265acb606affd01edea38050000000008515252516aacac6300000000", "65000000006365ac53", 0, -1338942849, "7912573937824058103cb921a59a7f910a854bf2682f4116a393a2045045a8c3"],
                ["2484991e047f1cf3cfe38eab071f915fe86ebd45d111463b315217bf9481daf0e0d10902a402000000006e71a424eb1347ffa638363604c0d5eccbc90447ff371e000bf52fc743ec832851bb564a0100000001abffffffffef7d014fad3ae7927948edbbb3afe247c1bcbe7c4c8f5d6cf97c799696412612020000000851536a5353006a001dfee0d7a0dd46ada63b925709e141863f7338f34f7aebde85d39268ae21b77c3068c01d0000000008535151ab00636563ffffffff018478070200000000095200635365ac52ab5341b08cd3", "", 3, 265623923, "24cb420a53b4f8bb477f7cbb293caabfd2fc47cc400ce37dbbab07f92d3a9575"],
                ["54839ef9026f65db30fc9cfcb71f5f84d7bb3c48731ab9d63351a1b3c7bc1e7da22bbd508e0300000000442ad138f170e446d427d1f64040016032f36d8325c3b2f7a4078766bdd8fb106e52e8d20000000003656500ffffffff02219aa101000000000851ababac52ab00659646bd02000000000552acacabac24c394a5", "ac", 0, 906807497, "69264faadcd1a581f7000570a239a0a26b82f2ad40374c5b9c1f58730514de96"],
                ["5036d7080434eb4eef93efda86b9131b0b4c6a0c421e1e5feb099a28ff9dd8477728639f77030000000951516aab535152ab5391429be9cce85d9f3d358c5605cf8c3666f034af42740e94d495e28b9aaa1001ba0c87580300000008006552ab00ab006affffffffd838978e10c0c78f1cd0a0830d6815f38cdcc631408649c32a25170099669daa0000000002acab8984227e804ad268b5b367285edcdf102d382d027789250a2c0641892b480c21bf84e3fb0100000000b518041e023d8653010000000001004040fb0100000000080051ac5200636a6300000000", "52ac", 0, 366357656, "bd0e88829afa6bdc1e192bb8b2d9d14db69298a4d81d464cbd34df0302c634c6"],
                ["9ad5ccf503fa4facf6a27b538bc910cce83c118d6dfd82f3fb1b8ae364a1aff4dcefabd38f03000000096365655263ac655300807c48130c5937190a996105a69a8eba585e0bd32fadfc57d24029cbed6446d30ebc1f100100000004000053650f0ccfca1356768df7f9210cbf078a53c72e0712736d9a7a238e0115faac0ca383f219d0010000000600ab536552002799982b0221b8280000000000000c41320000000000086552ac6365636a6595f233a3", "6a5152", 2, 553208588, "f99c29a79f1d73d2a69c59abbb5798e987639e36d4c44125d8dc78a94ddcfb13"],
                ["669538a204047214ce058aed6a07ca5ad4866c821c41ac1642c7d63ed0054f84677077a84f030000000853abacab6a655353ffffffff70c2a071c115282924e3cb678b13800c1d29b6a028b3c989a598c491bc7c76c5030000000752ac52ac5163ac80420e8a6e43d39af0163271580df6b936237f15de998e9589ec39fe717553d415ac02a4030000000463635153184ad8a5a4e69a8969f71288c331aff3c2b7d1b677d2ebafad47234840454b624bf7ac1d03000000056a63abab63df38c24a02fbc63a040000000002ab535ec3dc050000000002536500000000", "635153", 3, -190399351, "9615541884dfb1feeb08073a6a6aa73ef694bc5076e52187fdf4138a369f94d9"],
                ["a7f139e502af5894be88158853b7cbea49ba08417fbbca876ca6614b5a41432be34499987b000000000765635165abac63ffffffff8b8d70e96c7f54eb70da0229b548ced438e1ca2ba5ddd648a027f72277ee1efc0100000001abffffffff044f2c4204000000000165e93f550100000000050000526a6a94550304000000000365536aadc21c0300000000016300000000", "6aacac6363ab5265ac", 1, 2143189425, "6e3f97955490d93d6a107c18d7fe402f1cada79993bb0ff0d096357261b3a724"],
                ["3b94438f0366f9f53579a9989b86a95d134256ce271da63ca7cd16f7dd5e4bffa17d35133f010000000100ffffffff1aaad0c721e06ec00d07e61a84fb6dc840b9a968002ce7e142f943f06fd143a10100000008535151ac51ab0053b68b8e9c672daf66041332163e04db3f6048534bd718e1940b3fc3811c4eef5b7a56888b01000000001d58e38c012e38e700000000000852ab53ac6365536a00000000", "ab655352", 1, -935223304, "b3b336de141d4f071313a2207b2a0c7cf54a070dd8d234a511b7f1d13e23b0c4"],
                ["e5dca8a20456de0a67e185fa6ea94085ceae478d2c15c73cb931a500db3a1b6735dd1649ec0200000005ab536aabab32d11bbdcb81361202681df06a6b824b12b5cb40bb1a672cf9af8f2a836e4d95b7839327030000000951005365ab65abacabb345085932939eef0c724adef8a57f9e1bf5813852d957c039b6a12d9c2f201ea520fb030000000009ac5352005165acac6a5efc6072f1a421dc7dc714fc6368f6d763a5d76d0278b95fc0503b9268ccfadb48213a2500000000026a53ffffffff039ee1c4020000000009ac5353ab6353535163184018000000000005655265526a9a4a8a050000000001ac00000000", "65ab53ab6a00ab6553", 2, 1902561212, "7928ae8e86c0b0cad1b2c120ea313087437974382ee6d46443ca5ac3f5878b88"],
                ["972128b904e7b673517e96e98d80c0c8ceceae76e2f5c126d63da77ffd7893fb53308bb2da0300000006ac6552ab52acffffffff4cac767c797d297c079a93d06dc8569f016b4bf7a7d79b605c526e1d36a40e2202000000095365ab636aac6a6a6a69928d2eddc836133a690cfb72ec2d3115bf50fb3b0d10708fa5d2ebb09b4810c426a1db01000000060052526300001e8e89585da7e77b2dd2e30625887f0660accdf29e53a614d23cf698e6fc8ab03310e87700000000076a520051acac6555231ddb0330ec2d03000000000200abfaf457040000000004ab6a6352bdc42400000000000153d6dd2f04", "", 0, 209234698, "4a92fec1eb03f5bd754ee9bfd70707dc4420cc13737374f4675f48529be518e4"],
                ["1fb4085b022c6cfb848f8af7ba3ba8d21bd23ffa9f0bfd181cb68bcaaf2074e66d4974a31602000000090000006a6a6500acab6c12c07d9f3dbd2d93295c3a49e3757119767097e7fd5371f7d1ba9ba32f1a67a5a426f00000000000ffffffff018fd2fc04000000000363ac5100000000", "65ab006a6aab526a", 0, 1431502299, "8b7dd0ff12ca0d8f4dbf9abf0abba00e897c2f6fd3b92c79f5f6a534e0b33b32"],
                ["5374f0c603d727f63006078bd6c3dce48bd5d0a4b6ea00a47e5832292d86af258ea0825c260000000009655353636352526a6af2221067297d42a9f8933dfe07f61a574048ff9d3a44a3535cd8eb7de79fb7c45b6f47320200000003ac006affffffff153d917c447d367e75693c5591e0abf4c94bbdd88a98ab8ad7f75bfe69a08c470200000005ac65516365ffffffff037b5b7b000000000001515dc4d904000000000004bb26010000000004536a6aac00000000", "516552516352ac", 2, 328538756, "8bb7a0129eaf4b8fc23e911c531b9b7637a21ab11a246352c6c053ff6e93fcb6"],
                ["c441132102cc82101b6f31c1025066ab089f28108c95f18fa67db179610247086350c163bd010000000651525263ab00ffffffff9b8d56b1f16746f075249b215bdb3516cbbe190fef6292c75b1ad8a8988897c3000000000751ab6553abab00ffffffff02f9078b000000000009ab0053ac51ac00ab51c0422105000000000651006563525200000000", "ac51", 0, -197051790, "55acd8293ed0be6792150a3d7ced6c5ccd153ca7daf09cee035c1b0dac92bb96"],
                ["ab82ad3b04545bd86b3bb937eb1af304d3ef1a6d1343ed809b4346cafb79b7297c09e1648202000000086351ac5200535353ffffffff95d32795bbaaf5977a81c2128a9ec0b3c7551b9b1c3d952876fcb423b2dfb9e80000000005515363acac47a7d050ec1a603627ce6cd606b3af314fa7964abcc579d92e19c7aba00cf6c3090d6d4601000000056a516551633e794768bfe39277ebc0db18b5afb5f0c8117dde9b4dfd5697e9027210eca76a9be20d63000000000700520063ab6aacffffffff01ec2ddc050000000008ac52ac65ac65ac5100000000", "536300abab", 1, -2070209841, "b362da5634f20be7267de78b545d81773d711b82fe9310f23cd0414a8280801d"],
                ["8bff9d170419fa6d556c65fa227a185fe066efc1decf8a1c490bc5cbb9f742d68da2ab7f320100000007ab000053525365a7a43a80ab9593b9e8b6130a7849603b14b5c9397a190008d89d362250c3a2257504eb810200000007acabacac00ab51ee141be418f003e75b127fd3883dbf4e8c3f6cd05ca4afcaac52edd25dd3027ae70a62a00000000008ac52526a5200536affffffffb8058f4e1d7f220a1d1fa17e96d81dfb9a304a2de4e004250c9a576963a586ae0300000005abacac5363b9bc856c039c01d804000000000951656aac53005365acb0724e00000000000565abab63acea7c7a0000000000036a00ac00000000", "6565", 1, -1349282084, "2b822737c2affeefae13451d7c9db22ff98e06490005aba57013f6b9bbc97250"],
                ["0e1633b4041c50f656e882a53fde964e7f0c853b0ada0964fc89ae124a2b7ffc5bc97ea6230100000006ac6aacacabacffffffff2e35f4dfcad2d53ea1c8ada8041d13ea6c65880860d96a14835b025f76b1fbd9000000000351515121270867ef6bf63a91adbaf790a43465c61a096acc5a776b8e5215d4e5cd1492e611f761000000000600ac6aab5265ffffffff63b5fc39bcac83ca80ac36124abafc5caee608f9f63a12479b68473bd4bae769000000000965ac52acac5263acabffffffff0163153e020000000008ab005165ab65515300000000", "6a6aac00", 0, -968477862, "20732d5073805419f275c53784e78db45e53332ee618a9fcf60a3417a6e2ca69"],
                ["2b052c24022369e956a8d318e38780ef73b487ba6a8f674a56bdb80a9a63634c6110fb5154010000000251acffffffff48fe138fb7fdaa014d67044bc05940f4127e70c113c6744fbd13f8d51d45143e01000000005710db3804e01aa9030000000008acac6a516a5152abfd55aa01000000000751ab510000ac636d6026010000000000b97da9000000000000fddf3b53", "006552", 0, 595461670, "685d67d84755906d67a007a7d4fa311519467b9bdc6a351913246a41e082a29f"],
                ["073bc856015245f03b2ea2da62ccedc44ecb99e4250c7042f596bcb23b294c9dc92cfceb6b02000000095163abab52abab636afe292fb303b7c3f001000000000352636af3c49502000000000400ac6a535851850100000000066aac6553ab6500000000", "ab6aab53006aab52", 0, 247114317, "123916c6485cf23bfea95654a8815fbf04ce4d21a3b7f862805c241472906658"],
                ["7888b71403f6d522e414d4ca2e12786247acf3e78f1918f6d727d081a79813d129ee8befce0100000009ab516a6353ab6365abffffffff4a882791bf6400fda7a8209fb2c83c6eef51831bdf0f5dacde648859090797ec030000000153ffffffffbb08957d59fa15303b681bad19ccf670d7d913697a2f4f51584bf85fcf91f1f30200000008526565ac52ac63acffffffff0227c0e8050000000001ac361dc801000000000800515165ab00ab0000000000", "656a", 2, 1869281295, "f43378a0b7822ad672773944884e866d7a46579ee34f9afc17b20afc1f6cf197"],
                ["cc4dda57047bd0ca6806243a6a4b108f7ced43d8042a1acaa28083c9160911cf47eab910c40200000007526a0000ab6a63e4154e581fcf52567836c9a455e8b41b162a78c85906ccc1c2b2b300b4c69caaaa2ba0230300000008ab5152ac5100ab65ffffffff69696b523ed4bd41ecd4d65b4af73c9cf77edf0e066138712a8e60a04614ea1c0300000004ab6a000016c9045c7df7836e05ac4b2e397e2dd72a5708f4a8bf6d2bc36adc5af3cacefcf074b8b403000000065352ac5252acffffffff01d7e380050000000000cf4e699a", "525163656351", 1, -776533694, "ff18c5bffd086e00917c2234f880034d24e7ea2d1e1933a28973d134ca9e35d2"],
                ["b7877f82019c832707a60cf14fba44cfa254d787501fdd676bd58c744f6e951dbba0b3b77f0200000009ac515263ac53525300a5a36e500148f89c0500000000085265ac6a6a65acab00000000", "6563", 0, -1785108415, "cb6e4322955af12eb29613c70e1a00ddbb559c887ba844df0bcdebed736dffbd"],
                ["aeb14046045a28cc59f244c2347134d3434faaf980961019a084f7547218785a2bd03916f3000000000165f852e6104304955bda5fa0b75826ee176211acc4a78209816bbb4419feff984377b2352200000000003a94a5032df1e0d60390715b4b188c330e4bb7b995f07cdef11ced9d17ee0f60bb7ffc8e0100000002516513e343a5c1dc1c80cd4561e9dddad22391a2dbf9c8d2b6048e519343ca1925a9c6f0800a020000000665516365ac513180144a0290db27000000000006ab655151ab5138b187010000000007ab5363abac516a9e5cd98a", "53ac", 0, 478591320, "e8d89a302ae626898d4775d103867a8d9e81f4fd387af07212adab99946311ef"],
                ["c9270fe004c7911b791a00999d108ce42f9f1b19ec59143f7b7b04a67400888808487bd59103000000066a0052ac6565b905e76687be2dd7723b22c5e8269bc0f2000a332a289cfc40bc0d617cfe3214a61a85a30300000007ac63ac00635251560871209f21eb0268f175b8b4a06edd0b04162a974cf8b5dada43e499a1f22380d35ede0300000000792213fc58b6342cc8100079f9f5f046fb89f2d92cf0a2cb6d07304d32d9da858757037c0000000008abab51636565516affffffff02c72a8b03000000000452acac530dfb9f05000000000096f94307", "5253ab536351", 3, 543688436, "0278adbcc476d135493ae9bdcd7b3c2002df17f2d81c17d631c50c73e546c264"],
                ["57a5a04c0278c8c8e243d2df4bb716f81d41ac41e2df153e7096f5682380c4f441888d9d260300000004ab63ab6afdbe4203525dff42a7b1e628fe22bccaa5edbb34d8ab02faff198e085580ea5fcdb0c61b0000000002ac6affffffff03375e6c05000000000663ab516a6a513cb6260400000000007ca328020000000006516a636a52ab94701cc7", "0053ac5152", 0, -550925626, "b7ca991ab2e20d0158168df2d3dd842a57ab4a3b67cca8f45b07c4b7d1d11126"],
                ["072b75a504ad2550c2e9a02614bc9b2a2f50b5b553af7b87c0ef07c64ddc8d8934c96d216401000000036aabaca1387242a5bcd21099b016ad6045bed7dce603472757d9822cc5f602caa4ae20414d378b02000000026a63e4ac816734acdc969538d6f70b8ab43a2589f55e0177a4dc471bdd0eb61d59f0f46f6bb801000000065351526aab52d9f2977be76a492c3a7617b7a16dc29a3b0a7618f328c2f7d4fd9bafe760dc427a5066ef000000000465635165ffffffff02c5793600000000000165296820050000000002ac6300000000", "53006a6aac0052ab", 2, 66084636, "437e89bb6f70fd2ed2feef33350b6f6483b891305e574da03e580b3efd81ae13"],
                ["7e27c42d0279c1a05eeb9b9faedcc9be0cab6303bde351a19e5cbb26dd0d594b9d74f40d2b020000000200518c8689a08a01e862d5c4dcb294a2331912ff11c13785be7dce3092f154a005624970f84e0200000000500cf5a601e74c1f0000000000076aab52636a6a5200000000", "6500006a5351", 0, 449533391, "535ba819d74770d4d613ee19369001576f98837e18e1777b8246238ff2381dd0"],
                ["11414de403d7f6c0135a9df01cb108c1359b8d4e105be50a3dcba5e6be595c8817217490b20000000003005263ffffffff0c6becb9c3ad301c8dcd92f5cbc07c8bed7973573806d1489316fc77a829da03030000000700005253535352ffffffff2346d74ff9e12e5111aa8779a2025981850d4bf788a48de72baa2e321e4bc9ca00000000056352acab63cc585b64045e0385050000000009ab5253ab516aacac00efa9cf0300000000065200635151acbe80330400000000070063635100ab000be159050000000007525300655300ac00000000", "51656a0051ab", 0, 683137826, "d4737f3b58f3e5081b35f36f91acde89dda00a6a09d447e516b523e7a99264d5"],
                ["1c6b5f29033fc139338658237a42456123727c8430019ca25bd71c6168a9e35a2bf54538d80100000008536aac52ac6a6a52ffffffff3fb36be74036ff0c940a0247c451d923c65f826793d0ac2bb3f01ecbec8033290100000007ab000051ab6363ffffffff5d9eca0cf711685105bd060bf7a67321eaef95367acffab36ce8dedddd632ee2000000000652ac6a63ac517167319e032d26de040000000003516363dc38fb010000000000b37b00000000000006ab520051ac534baba51f", "636300ababac6563", 0, -2049129935, "3282a2ec6b8c87c9303e6060c17b421687db1bd35fbfa0345b48f2490e15b6cc"],
                ["978b9dad0214cfc7ce392d74d9dcc507350dc34007d72e4125861c63071ebf2cc0a6fd4856020000000651ac6a6aab52ffffffff47f20734e3370e733f87a6edab95a7a268ae44db7a8974e255614836b22938720200000008635265ac51516553ffffffff0137b2560100000000035252ac2f3363e9", "006aab6352", 1, 2014249801, "55611a5fb1483bce4c14c33ed15198130e788b72cd8929b2ceef4dd68b1806bf"],
                ["442f1c8703ab39876153c241ab3d69f432ba6db4732bea5002be45c8ca10c3a2356fe0e9590300000001accb2b679cab7c58a660cb6d4b3452c21cd7251a1b77a52c300f655f5baeb6fa27ff5b79880300000003005252e5ccf55712bc8ed6179f6726f8a78f3018a7a0391594b7e286ef5ee99efdcde302a102cc0200000009006352526351536a63ffffffff04443f63030000000006536a63ab63651405fb020000000009ac535351525300ab6a9f172b000000000004ab535263ad5c50050000000008656a65ab630000ac00000000", "65636aab006552", 2, 2125838294, "b3ff10f21e71ebc8b25fe058c4074c42f08617e0dcc03f9e75d20539d3242644"],
                ["2b3470dd028083910117f86614cdcfb459ee56d876572510be4df24c72e8f58c70d5f5948b03000000066aab65635265da2c3aac9d42c9baafd4b655c2f3efc181784d8cba5418e053482132ee798408ba43ccf90300000000ffffffff047dda4703000000000765516a52ac53009384a603000000000651636a63ab6a8cf57a03000000000352ab6a8cf6a405000000000952636a6a6565525100661e09cb", "ac520063ac6a6a52", 1, 1405647183, "9b360c3310d55c845ef537125662b9fe56840c72136891274e9fedfef56f9bb5"],
                ["d74282b501be95d3c19a5d9da3d49c8a88a7049c573f3788f2c42fc6fa594f59715560b9b00000000009655353525265ac52ac9772121f028f8303030000000003510065af5f47040000000007ac516a6551630000000000", "acab53006363ac", 0, -1113209770, "2f482b97178f17286f693796a756f4d7bd2dfcdbecd4142528eec1c7a3e5101a"],
                ["3a5644a9010f199f253f858d65782d3caec0ac64c3262b56893022b9796086275c9d4d097b02000000009d168f7603a67b30050000000007ac51536a0053acd9d88a050000000007655363535263ab3cf1f403000000000352ac6a00000000", "005363536565acac6a", 0, -1383947195, "6390ab0963cf611e0cea35a71dc958b494b084e6fd71d22217fdc5524787ade6"],
                ["67b3cc43049d13007485a8133b90d94648bcf30e83ba174f5486ab42c9107c69c5530c5e1f0000000003005100ffffffff9870ebb65c14263282ea8d41e4f4f40df16b565c2cf86f1d22a9494cad03a67f01000000016a5a121bee5e359da548e808ae1ad6dfccae7c67cbb8898d811638a1f455a671e822f228ef030000000151c1fcc9f9825f27c0dde27ea709da62a80a2ff9f6b1b86a5874c50d6c37d39ae31fb6c8a0030000000163553b8786020ca74a00000000000665635153ab5275c0760000000000020052e659b05d", "636aab6a6a", 0, -342795451, "f77c3322c97b1681c17b1eba461fa27b07e04c1534e8aaf735a49cab72c7c2e2"],
                ["bda1ff6804a3c228b7a12799a4c20917301dd501c67847d35da497533a606701ad31bf9d5e0300000001ac16a6c5d03cf516cd7364e4cbbf5aeccd62f8fd03cb6675883a0636a7daeb650423cb1291010000000500656553ac4a63c30b6a835606909c9efbae1b2597e9db020c5ecfc0642da6dc583fba4e84167539a8020000000865525353515200acffffffff990807720a5803c305b7da08a9f24b92abe343c42ac9e917a84e1f335aad785d00000000026a52ffffffff04981f20030000000001ab8c762200000000000253ab690b9605000000000151ce88b301000000000753526a6a51006500000000", "000052ac52530000", 1, -1809193140, "5299b0fb7fc16f40a5d6b337e71fcd1eb04d2600aefd22c06fe9c71fe0b0ba54"],
                ["2ead28ff0243b3ab285e5d1067f0ec8724224402b21b9cef9be962a8b0d153d401be99bbee0000000004ac635153ffffffff6985987b7c1360c9fa8406dd6e0a61141709f0d5195f946da55ed83be4e3895301000000020053ffffffff016503d20500000000085251ac6a65656a6a00000000", "51abab", 1, 1723793403, "67483ee62516be17a2431a163e96fd88a08ff2ce8634a52e42c1bc04e30f3f8a"],
                ["db4904e6026b6dd8d898f278c6428a176410d1ffbde75a4fa37cda12263108ccd4ca6137440100000007656a0000515263ffffffff1db7d5005c1c40da0ed17b74cf6b2a6ee2c33c9e0bacda76c0da2017dcac2fc70200000004abab6a53ffffffff0454cf2103000000000153463aef000000000009ab6a630065ab52636387e0ed050000000000e8d16f05000000000352ac63e4521b22", "", 1, 1027042424, "48315a95e49277ab6a2d561ee4626820b7bab919eea372b6bf4e9931ab221d04"],
                ["dca31ad10461ead74751e83d9a81dcee08db778d3d79ad9a6d079cfdb93919ac1b0b61871102000000086500525365ab51ac7f7e9aed78e1ef8d213d40a1c50145403d196019985c837ffe83836222fe3e5955e177e70100000006525152525300ffffffff5e98482883cc08a6fe946f674cca479822f0576a43bf4113de9cbf414ca628060100000006ac53516a5253ffffffff07490b0b898198ec16c23b75d606e14fa16aa3107ef9818594f72d5776805ec502000000036a0052ffffffff01932a2803000000000865ab6551ac6a516a2687aa06", "635300ac", 2, -1880362326, "74d6a2fa7866fd8b74b2e34693e2d6fd690410384b7afdcd6461b1ae71d265ce"],
                ["e14e1a9f0442ab44dfc5f6d945ad1ff8a376bc966aad5515421e96ddbe49e529614995cafc03000000055165515165fffffffff97582b8290e5a5cfeb2b0f018882dbe1b43f60b7f45e4dd21dbd3a8b0cfca3b0200000000daa267726fe075db282d694b9fee7d6216d17a8c1f00b2229085495c5dc5b260c8f8cd5d000000000363ac6affffffffaab083d22d0465471c896a438c6ac3abf4d383ae79420617a8e0ba8b9baa872b010000000963526563ac5363ababd948b5ce022113440200000000076a636552006a53229017040000000000e6f62ac8", "526353636a65", 3, -485265025, "1bc8ad76f9b7c366c5d052dc479d6a8a2015566d3a42e93ab12f727692c89d65"],
                ["720d4693025ca3d347360e219e9bc746ef8f7bc88e8795162e5e2f0b0fc99dc17116fc937100000000046353520045cb1fd79824a100d30b6946eab9b219daea2b0cdca6c86367c0c36af98f19ac64f3575002000000008a1c881003ed16f3050000000008536a63630000abac45e0e704000000000151f6551a05000000000963536565515363abab00000000", "6553ab6a6a510000ab", 1, 1249091393, "a575fa4f59a8e90cd07de012c78fe8f981183bb170b9c50fcc292b8c164cbc3b"],
                ["69df842a04c1410bfca10896467ce664cfa31c681a5dac10106b34d4b9d4d6d0dc1eac01c1000000000551536a5165269835ca4ad7268667b16d0a2df154ec81e304290d5ed69e0069b43f8c89e673328005e200000000076a5153006aacabffffffffc9314bd80b176488f3d634360fcba90c3a659e74a52e100ac91d3897072e3509010000000765abac51636363ffffffff0e0768b13f10f0fbd2fa3f68e4b4841809b3b5ba0e53987c3aaffcf09eee12bf0300000008ac535263526a53ac514f4c2402da8fab0400000000001ef15201000000000451526a52d0ec9aca", "525365ac52", 1, 313967049, "a72a760b361af41832d2c667c7488dc9702091918d11e344afc234a4aea3ec44"],
                ["adf2340d03af5c589cb5d28c06635ac07dd0757b884d4777ba85a6a7c410408ad5efa8b19001000000045100ab00ffffffff808dc0231c96e6667c04786865727013922bcb7db20739b686f0c17f5ba70e8f0300000000fd2332a654b580881a5e2bfec8313f5aa878ae94312f37441bf2d226e7fc953dcf0c77ab000000000163aa73dc580412f8c2050000000005636aacac63da02d502000000000153e74b52020000000001536b293d030000000009636552ababacab526500000000", "000052ab52ababab", 0, -568651175, "2c45d021db545df7167ac03c9ee56473f2398d9b2b739cf3ff3e074501d324f8"],
                ["e4fec9f10378a95199c1dd23c6228732c9de0d7997bf1c83918a5cfd36012476c0c3cba24002000000085165536500ac0000ad08ab93fb49d77d12a7ccdbb596bc5110876451b53a79fdce43104ff1c316ad63501de801000000046a6352ab76af9908463444aeecd32516a04dd5803e02680ed7f16307242a794024d93287595250f4000000000089807279041a82e603000000000200521429100200000000055253636a63f20b940400000000004049ed04000000000500ab5265ab43dfaf7d", "6563526aac", 2, -1923470368, "32f3c012eca9a823bebb9b282240aec40ca65df9f38da43b1dcfa0cac0c0df7e"],
                ["4000d3600100b7a3ff5b41ec8d6ccdc8b2775ad034765bad505192f05d1f55d2bc39d0cbe10100000007ab5165ac6a5163ffffffff034949150100000000026a6a92c9f6000000000008ab6553ab6aab635200e697040000000007636a5353525365237ae7d2", "52000063", 0, -880046683, "c76146f68f43037289aaeb2bacf47408cddc0fb326b350eb4f5ef6f0f8564793"],
                ["eabc0aa701fe489c0e4e6222d72b52f083166b49d63ad1410fb98caed027b6a71c02ab830c03000000075253ab63530065ffffffff01a5dc0b05000000000253533e820177", "", 0, 954499283, "1d849b92eedb9bf26bd4ced52ce9cb0595164295b0526842ab1096001fcd31b1"],
                ["d48d55d304aad0139783b44789a771539d052db565379f668def5084daba0dfd348f7dcf6b00000000006826f59e5ffba0dd0ccbac89c1e2d69a346531d7f995dea2ca6d7e6d9225d81aec257c6003000000096a655200ac656552acffffffffa188ffbd5365cae844c8e0dea6213c4d1b2407274ae287b769ab0bf293e049eb0300000005ac6a6aab51ad1c407c5b116ca8f65ed496b476183f85f072c5f8a0193a4273e2015b1cc288bf03e9e2030000000252abffffffff04076f44040000000006655353abab53be6500050000000003ac65ac3c15040500000000095100ab536353516a52ed3aba04000000000900ac53ab53636aabac00000000", "5253526563acac", 2, -1506108646, "bbee17c8582514744bab5df50012c94b0db4aff5984d2e13a8d09421674404e2"],
                ["9746f45b039bfe723258fdb6be77eb85917af808211eb9d43b15475ee0b01253d33fc3bfc502000000065163006a655312b12562dc9c54e11299210266428632a7d0ee31d04dfc7375dcad2da6e9c11947ced0e000000000009074095a5ac4df057554566dd04740c61490e1d3826000ad9d8f777a93373c8dddc4918a00000000025351ffffffff01287564030000000004636a00ab00000000", "52", 2, -1380411075, "84af1623366c4db68d81f452b86346832344734492b9c23fbb89015e516c60b2"],
                ["8731b64903d735ba16da64af537eaf487b57d73977f390baac57c7b567cb2770dfa2ef65870100000001635aedd990c42645482340eacb0bfa4a0a9e888057389c728b5b6a8691cdeb1a6a67b45e140200000008ac53526a52516551ffffffff45c4f567c47b8d999916fd49642cbc5d10d43c304b99e32d044d35091679cb860100000003006a51ffffffff0176d6c200000000000000000000", "ab6a65ab53", 2, -1221546710, "ccfdba36d9445f4451fb7cbf0752cc89c23d4fc6fff0f3930d20e116f9db0b95"],
                ["f5cfc52f016209ab1385e890c2865a74e93076595d1ca77cbe8fbf2022a2f2061a90fb0f3e010000000253acffffffff027de73f0200000000085252ac510052acac49cd6a020000000000e6c2cb56", "516552535300ab63", 0, -1195302704, "5532717402a2da01a1da912d824964024185ca7e8d4ad1748659dc393a14182b"],
                ["df0a32ae01c4672fd1abd0b2623aae0a1a8256028df57e532f9a472d1a9ceb194267b6ee190200000009536a6a51516a525251b545f9e803469a2302000000000465526500810631040000000000441f5b050000000006530051006aaceb183c76", "536a635252ac6a", 0, 1601138113, "9a0435996cc58bdba09643927fe48c1fc908d491a050abbef8daec87f323c58f"],
                ["d102d10c028b9c721abb259fe70bc68962f6cae384dabd77477c59cbeb1fb26266e091ba3e0100000002516affffffffe8d7305a74f43e30c772109849f4cd6fb867c7216e6d92e27605e69a0818899700000000026a65ecf82d58027db4620500000000026552c28ed3010000000001ab00000000", "0051ab515365", 1, -131815460, "1d1757a782cb5860302128bcbe9398243124a2f82d671a113f74f8e582c7a182"],
                ["cef930ed01c36fcb1d62ceef931bef57098f27a77a4299904cc0cbb44504802d535fb11557010000000153ffffffff02c8657403000000000863ac655253520063d593380400000000046aab536a00000000", "656a0051ab6365ab53", 0, -351313308, "e69dba3efb5c02af2ab1087d0a990678784671f4744d01ca097d71aec14dd8e9"],
                ["b1c0b71804dff30812b92eefb533ac77c4b9fdb9ab2f77120a76128d7da43ad70c20bbfb990200000002536392693e6001bc59411aebf15a3dc62a6566ec71a302141b0c730a3ecc8de5d76538b30f55010000000665535252ac514b740c6271fb9fe69fdf82bf98b459a7faa8a3b62f3af34943ad55df4881e0d93d3ce0ac0200000000c4158866eb9fb73da252102d1e64a3ce611b52e873533be43e6883137d0aaa0f63966f060000000001abffffffff04a605b604000000000851006a656a630052f49a0300000000000252515a94e1050000000009abac65ab0052abab00fd8dd002000000000651535163526a2566852d", "ac5363", 0, -1718831517, "b0dc030661783dd9939e4bf1a6dfcba809da2017e1b315a6312e5942d714cf05"],
                ["6a270ee404ebc8d137cfd4bb6b92aa3702213a3139a579c1fc6f56fbc7edd9574ef17b13f30100000009ab00ab656565ababacffffffffaa65b1ab6c6d87260d9e27a472edceb7dd212483e72d90f08857abf1dbfd46d10100000000fffffffff93c4c9c84c4dbbe8a912b99a2830cfe3401aebc919041de063d660e585fc9f002000000096aabacab52ac6a53acfa6dcef3f28355a8d98eee53839455445eeee83eecd2c854e784efa53cee699dbfecaebd0100000003ab6a51ffffffff04f7d71b050000000009ac6a536aac6a6365513c37650500000000065265abab6a53fa742002000000000039ed82030000000009516aac635165ab51ab2fdabd17", "ab535252526563", 1, -1326210506, "1dec0d5eb921bf5b2df39c8576e19c38d0c17254a4a0b78ac4b5422bcc426258"],
                ["3657e4260304ccdc19936e47bdf058d36167ee3d4eb145c52b224eff04c9eb5d1b4e434dfc0000000001ab58aefe57707c66328d3cceef2e6f56ab6b7465e587410c5f73555a513ace2b232793a74400000000036a006522e69d3a785b61ad41a635d59b3a06b2780a92173f85f8ed428491d0aaa436619baa9c4501000000046351abab2609629902eb7793050000000000a1b967040000000003525353a34d6192", "516a", 0, -1761874713, "0a2ff41f6d155d8d0e37cd9438f3b270df9f9214cda8e95c76d5a239ca189df2"],
                ["a0eb6dc402994e493c787b45d1f946d267b09c596c5edde043e620ce3d59e95b2b5b93d43002000000096a5252526aac63ab6555694287a279e29ee491c177a801cd685b8744a2eab83824255a3bcd08fc0e3ea13fb8820000000009abab6365ab52ab0063ffffffff029e424a040000000008acab53ab516a636a23830f0400000000016adf49c1f9", "ac0065ac6500005252", 1, 669294500, "e05e3d383631a7ed1b78210c13c2eb26564e5577db7ddfcea2583c7c014091d4"],
                ["6e67c0d3027701ef71082204c85ed63c700ef1400c65efb62ce3580d187fb348376a23e9710200000001655b91369d3155ba916a0bc6fe4f5d94cad461d899bb8aaac3699a755838bfc229d6828920010000000765536353526a52ffffffff04c0c792000000000005650052535372f79e000000000001527fc0ee010000000005ac5300ab65d1b3e902000000000251aba942b278", "6a5151", 0, 1741407676, "e657e2c8ec4ebc769ddd3198a83267b47d4f2a419fc737e813812acefad92ff7"],
                ["8f53639901f1d643e01fc631f632b7a16e831d846a0184cdcda289b8fa7767f0c292eb221a00000000046a53abacffffffff037a2daa01000000000553ac6a6a51eac349020000000005ac526552638421b3040000000007006a005100ac63048a1492", "ac65", 0, 1033685559, "da86c260d42a692358f46893d6f91563985d86eeb9ea9e21cd38c2d8ffcfcc4d"],
                ["491f99cb01bdfba1aa235e5538dac081fae9ce55f9622de483afe7e65105c2b0db75d360d200000000045251636340b60f0f041421330300000000096351ac000051636553ce2822040000000005516a00ac5180c8e40300000000025100caa8570400000000020000cfdc8da6", "6a5100516aab655365", 0, -953727341, "397c68803b7ce953666830b0221a5e2bcf897aa2ded8e36a6b76c497dcb1a2e1"],
                ["b3cad3a7041c2c17d90a2cd994f6c37307753fa3635e9ef05ab8b1ff121ca11239a0902e700300000009ab635300006aac5163ffffffffcec91722c7468156dce4664f3c783afef147f0e6f80739c83b5f09d5a09a57040200000004516a6552ffffffff969d1c6daf8ef53a70b7cdf1b4102fb3240055a8eaeaed2489617cd84cfd56cf020000000352ab53ffffffff46598b6579494a77b593681c33422a99559b9993d77ca2fa97833508b0c169f80200000009655300655365516351ffffffff04d7ddf800000000000853536a65ac6351ab09f3420300000000056aab65abac33589d04000000000952656a65655151acac944d6f0400000000006a8004ba", "005165", 1, 1035865506, "fe1dc9e8554deecf8f50c417c670b839cc9d650722ebaaf36572418756075d58"],
                ["e1cfd73b0125add9e9d699f5a45dca458355af175a7bd4486ebef28f1928d87864384d02df02000000036a0051ffffffff0357df030100000000036a5365777e2d04000000000763ab6a00005265f434a601000000000351655100000000", "ab53ab", 0, -1936500914, "950f4b4f72ccdf8a6a0f381265d6c8842fdb7e8b3df3e9742905f643b2432b69"],
                ["cf781855040a755f5ba85eef93837236b34a5d3daeb2dbbdcf58bb811828d806ed05754ab8010000000351ac53ffffffffda1e264727cf55c67f06ebcc56dfe7fa12ac2a994fecd0180ce09ee15c480f7d00000000096351516a51acac00ab53dd49ff9f334befd6d6f87f1a832cddfd826a90b78fd8cf19a52cb8287788af94e939d6020000000700525251ac526310d54a7e8900ed633f0f6f0841145aae7ee0cbbb1e2a0cae724ee4558dbabfdc58ba6855010000000552536a53abfd1b101102c51f910500000000096300656a525252656a300bee010000000009ac52005263635151abe19235c9", "53005365", 2, 1422854188, "d5981bd4467817c1330da72ddb8760d6c2556cd809264b2d85e6d274609fc3a3"],
                ["fea256ce01272d125e577c0a09570a71366898280dda279b021000db1325f27edda41a53460100000002ab53c752c21c013c2b3a01000000000000000000", "65", 0, 1145543262, "076b9f844f6ae429de228a2c337c704df1652c292b6c6494882190638dad9efd"]
            ];
            for (let k of t) {
                let tx = new Transaction({rawTx: k[0], keepRawTx: 1});
                equal(tx.sigHash(k[2], {scriptPubKey: k[1], sigHashType: k[3]}), k[4]);
            }
        });

        it('sigHashSegwit', () => {
            // Native P2WPKH
            let rawTx = "0100000002fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f0000000000eeffffffef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a0100000000ffffffff02202cb206000000001976a9148280b37df378db99f66f85c95a783a76ac7a6d5988ac9093510d000000001976a9143bde42dbee7e4dbe6a21b2d50ce2f0167faa815988ac11000000";
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(1, {value: 600000000,
                scriptPubKey: "1976a9141d0f172a0ecb48aee1be1f2687d2963ae33f71a188ac",
                sigHashType: SIGHASH_ALL}), "c37af31116d1b27caf68aae9e3ac82f1477929014d5b917657d0eb49478cb670");
            // P2SH-P2WPKH
            rawTx = "0100000001db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000000feffffff02b8b4eb0b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d96388ac0008af2f000000001976a914fd270b1ee6abcaea97fea7ad0402e8bd8ad6d77c88ac92040000";
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 1000000000,
                scriptPubKey: "1976a91479091972186c449eb1ded22b78e40d009bdf008988ac",
                sigHashType: SIGHASH_ALL}), "64f3b0f4dd2bb3aa1ce8566d220cc74dda9df97d8490cc81d89d735c92e59fb6");
            // Native P2WSH
            rawTx = "0100000002fe3dc9208094f3ffd12645477b3dc56f60ec4fa8e6f5d67c565d1c6b9216b36e0000000000ffffffff0815cf020f013ed6cf91d29f4202e8a58726b1ac6c79da47c23d1bee0a6925f80000000000ffffffff0100f2052a010000001976a914a30741f8145e5acadf23f751864167f32e0963f788ac00000000";
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(1, {value: 4900000000,
                scriptPubKey: "23210255a9626aebf5e29c0e6538428ba0d1dcf6ca98ffdf086aa8ced5e0d0215ea465ac",
                sigHashType: SIGHASH_SINGLE}), "fef7bd749cce710c5c052bd796df1af0d935e59cea63736268bcbe2d2134fc47");
            rawTx = "010000000136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000000ffffffff0200e9a435000000001976a914389ffce9cd9ae88dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e6e84c138dbbd3c3ee41588ac00000000";

            // P2SH-P2WSH SIGHASH_ALL
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
                scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
                sigHashType: SIGHASH_ALL}), "185c0be5263dce5b4bb50a047973c1b6272bfbd0103a89444597dc40b248ee7c");
            // P2SH-P2WSH SIGHASH_NONE
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
                scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
                sigHashType: SIGHASH_NONE}), "e9733bc60ea13c95c6527066bb975a2ff29a925e80aa14c213f686cbae5d2f36");

            // P2SH-P2WSH SIGHASH_SINGLE
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
                scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
                sigHashType: SIGHASH_SINGLE}), "1e1f1c303dc025bd664acb72e583e933fae4cff9148bf78c157d1e8f78530aea");

            // P2SH-P2WSH SIGHASH_ALL + SIGHASH_ANYONECANPAY
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
                scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
                sigHashType: SIGHASH_ALL + SIGHASH_ANYONECANPAY}),
                "2a67f03e63a6a422125878b40b82da593be8d4efaafe88ee528af6e5a9955c6e");

            // P2SH-P2WSH SIGHASH_SINGLE + SIGHASH_ANYONECANPAY
            equal(new Transaction({rawTx: rawTx}).sigHashSegwit(0, {value: 987654321,
                    scriptPubKey: "cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae",
                    sigHashType: SIGHASH_SINGLE + SIGHASH_ANYONECANPAY}),
                "511e8e52ed574121fc1b654970395502128263f62662e076dc6baf05c2e6a99b");
        });

        it('sign PUBKEY input', () => {
            let t = "0100000001729e7f0a0d7c680c274b76310d46ccbf2f2a05bd76d07f0556450e20b68465d700000000494830450221008655a5" +
            "a16f6563ebef7e9d085a62cdac99329b47ec9d5537de3f455b2a2da3ce02207ab34a1e223245d727a0e639ec8b0ec75ac04827" +
            "4f102598fd0a50e7854eff1301ffffffff01c005d901000000001976a91475a31c60acaf594e48a0955c2ec6396c2f7873cb88" +
            "ac00000000";
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "d76584b6200e4556057fd076bd052a2fbfcc460d31764b270c687c0d0a7f9e72"});
            tx.addOutput({value: 31000000, address: "mrExkdzwj7y5CW2BYSgFDPfJ8oWm2v49L2"});
            tx.signInput(0, {privateKey: "bb127228ddcb9209d7fd6f36b02f7dfa6252af40bb2f1cbc7a557da8027ff866",
                scriptPubKey: "2103bc85b4247004744d3e96f861802ec49ea4c64902ded840509879130356b4a0feac"});
            equal(t, tx.serialize());
        });

        it('sign P2PKH input', () => {
            let t = "0100000001858a386d766fc546a68f454142d5912634988c9a192c725ade3a0e38f96ed137010000006a47304402201c26" +
                 "cbc45d001eeae3c49628dde4520a673c3b29728764356184ade9c31b36a40220691677e7344ba11266e5872db6b5946834" +
                 "33b864f2c187a0dc3ea33739d2dd6f012102a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c818ee" +
                 "b4ffffffff01702a290a000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
            let a = new Address(new PrivateKey("7b56e2b7bd189f4491d43a1d209e6268046df1741f61b6397349d7aa54978e76", {testnet: true}),
                {addressType: "P2PKH"});
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "37d16ef9380e3ade5a722c199a8c98342691d54241458fa646c56f766d388a85",
                vOut: 1, address: a});
            tx.addOutput({value: 170470000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv"});
            equal(tx.serialize(), t);

            t = "01000000029d05abe190f4a75455aa5ec940a0d524607ecd336e6dcc69c4c22f7ee817964a000000006b4830450221008" +
                 "bac636fc13239b016363c362d561837b82a0a0860f3da70dfa1dbebe6ee73a00220077b738b9965dc00b0a7e649e7fda2" +
                 "9615b456323cf2f6aae944ebed1c68e71a012102a8fb85e98c99b79150df12fde488639d8445c57babef83d53c66c1e5c" +
                 "818eeb4ffffffffee535abe379c7535872f1a76cd84aa7f334bf3ee21696632049d339a17df89f8000000006b48304502" +
                 "2100eace9a85848b8ed98b5b26fe42c8ced3d8e4a6cf7779d2275f1c7966b4f0f6700220189adf1333ae7fc6be5fe3fd8" +
                 "4cb168e55ea4983c86145030b88ba25ddf916ee012103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393e4" +
                 "b4d9dc78cd5dffffffff0180b2e60e000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "4a9617e87e2fc2c469cc6d6e33cd7e6024d5a040c95eaa5554a7f490e1ab059d",
                address: "mkH3NMrEcijyVutDhvV5fArXJ3A2sxspX9"});
            tx.addInput({txId: "f889df179a339d0432666921eef34b337faa84cd761a2f8735759c37be5a53ee",
                address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addOutput({value: 250000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv"});
            tx.signInput(1, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq"});
            equal(tx.serialize(), t);

            t = "01000000019c5287d981ac92491a4555a0d135748c06fbc36ffe80b2806ce719d39262cc23000000006a47304402201b" +
                 "db3fd4964b1e200e4167a5721bf4c141fa97177a0719ace9a508c24c923feb0220063f353306bcdf756f4d2c117fb185" +
                 "035c14f841b8462091637451eba2c1d77c032103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393e4b4d9" +
                 "dc78cd5dffffffff014062b007000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "23cc6292d319e76c80b280fe6fc3fb068c7435d1a055451a4992ac81d987529c",
                address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addOutput({value: 129000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
                sigHashType: SIGHASH_SINGLE});
            equal(tx.serialize(), t);

            t = "010000000252dc328cba19ac25711ea56755fe9e866e24feeab97fa9b31b2030c86f40a9b3000000006a4730440220" +
                 "142022a671ebc2a51760920b5938f61f5f79a41db69380115a6d4c2765b444540220309fa9b0bd347561473cdce1a1" +
                 "adc1b19fcfa07b7709c6ec115d11bb76f0d5fd012103b5963945667335cda443ba88b6257a15d033a20b60eb2cc393" +
                 "e4b4d9dc78cd5dffffffffe28966244d618bada9429fc56ce8843b18ce039cecbb86ff03695a92fd34969200000000" +
                 "6a473044022043e021bcb037a2c756fb2a3e49ecbcf9a9de74b04ab30252155587c2ef4fd0670220718b96ee51b611" +
                 "2825be87e016ff4985188d70c7661af29dd558b4485ec034e9032102a8fb85e98c99b79150df12fde488639d8445c5" +
                 "7babef83d53c66c1e5c818eeb4ffffffff0200e1f505000000001976a9145bfbbcfef367417bd85a5d51ae68a0221d" +
                 "a3b45f88ac40084e05000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({"txId": "b3a9406fc830201bb3a97fb9eafe246e869efe5567a51e7125ac19ba8c32dc52",
                address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addInput({"txId": "929634fd925a6903ff86bbec9c03ce183b84e86cc59f42a9ad8b614d246689e2",
                address: "mkH3NMrEcijyVutDhvV5fArXJ3A2sxspX9"});
            tx.addOutput({value: 100000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addOutput({value: 89000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(1, {privateKey: "cRiTUeUav1FMR4UbQh2gW9n8RfpNHLBHsEYXJYa4Rv6ZrCdTPGqv",
                sigHashType: SIGHASH_SINGLE});
            tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
                sigHashType: SIGHASH_ALL});
            equal(tx.serialize(), t);

            t = new Transaction();
            t.addInput({txId:"42361048a18b9e619f3dfe16f8f5032f0912cbc8f535c233731e83064c81bfe3",
                address:"1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"});
            t.addOutput({value: 100000000, address: "1Bitapsw1aT8hkLXFtXwZQfHgNwNJEyJJ1"});
            t.signInput(0, {privateKey:"5JEBR43smtENF37sib2fUM2skB5PKFBGbqoQaKyTr8vvqW28HxP"});
            equal(t.vIn[0].scriptSigOpcodes === "[72] [33]", false);

            t = "010000000278be2e22c8880c01fe9d9d8e4a2f42f0f89d6b6d3f0f2dee79fd4b3be4ff9307000000006b483045022" +
                 "100a45cab68bff1ef79b463ebffa3a3c546cd467e6aabb051c87c0116c968a5e2e602202b21d93705f768533b5a3e" +
                 "0e17871ae4d8a61dfde213096cdf5e38abbf8ba0e7032103b5963945667335cda443ba88b6257a15d033a20b60eb2" +
                 "cc393e4b4d9dc78cd5dffffffff8ae976106659e8bec5ef09fc84f989c7bab6035be984648bd1ea7b29981613cb00" +
                 "0000006b483045022100a376f93ed693558f8c99bcb3adbb262aff585f240e897c82478178b6ad60f3ad0220546f2" +
                 "376b72f2f07d16f6e0e2f71181bc3e134ff60336c733dda01e555300f2a032103b5963945667335cda443ba88b625" +
                 "7a15d033a20b60eb2cc393e4b4d9dc78cd5dffffffff0100e1f505000000001976a9145bfbbcfef367417bd85a5d5" +
                 "1ae68a0221da3b45f88ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "0793ffe43b4bfd79ee2d0f3f6d6b9df8f0422f4a8e9d9dfe010c88c8222ebe78",
                address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addInput({txId: "cb131698297bead18b6484e95b03b6bac789f984fc09efc5bee859661076e98a",
                address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.addOutput({value: 100000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(1, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
                sigHashType: SIGHASH_SINGLE});
            tx.signInput(0, {privateKey: "cSimowS3sa1eD762ZtRJUmQ7f9EqpqJa8qieXs4hKjkao2nipoTq",
                sigHashType: SIGHASH_SINGLE});
            equal(tx.serialize(), t);

            t = "0100000000010ae86eef67d8c6a4fa42c8d1ba56095cfd580675f5e23d4c3eb4e0cd94f749e76e0d00000023220020836874e10" +
            "976a55b3797305458e5062f610ef36d965ae90a2a6e1cf2b82196d6ffffffff490f6350a3dea457086e34431c9376f810d2cc13" +
            "45d80b6ca13774336b4a6d430c000000232200205f074989fce0d834b6d5f0f7458fd784c3fef6edf220d286f609572b351af54" +
            "4ffffffffb9d80c9a4c46950ca456a99ba8f332072ca8fc77283896bc515315ee3659b0b40000000023220020f0ebbea7b0628d" +
            "9deb464f8dff4a13ab600a9d152babd55397b935a15e69c6eaffffffff5e17c16acf59553c4f12e155b0c2ed890bc30305eea51" +
            "7e95b96aa56602e1e2d0100000023220020d41098b592f0444588603f6317fa221071a431488a43412e1947d17fd8cf08e7ffff" +
            "ffffe6bb632279123095c9c20cfa475dedc652ed9a145df8dbb97629713d5ea9360b14000000232200209e2cfbe506e1f4069d8" +
            "a210065977d5084942736620237689a505c00af3b0be5fffffffff6fabc0398da61b54655a5570c636c195cb7b430629c654806" +
            "64c247772a81a5a500000023220020eff46382a9e523f43b486fd9bcdca1b05283ffd821b942eb84eda4a6c9049c77ffffffffe" +
            "b7f7d50ee09fa1de8a9ad94e20a35afd568b724bda5e88bd95b9293c1d092200400000023220020aad3f8ee6f95dd7c3b18df80" +
            "aa0ce15cbd95119805460c5f2087af68b0576cb6ffffffff413956ecb16eb70a611a87af4308487b66ec2b24914fececb31cdd2" +
            "65629490c00000000232200203acbfd4896a9d6f1e80e0baceec00ca9053ebb0b414a431863e86bea40bcb8d7ffffffffbb81e5" +
            "985a904055bdd5056b94716595d64e7c557a19f7e210173134923582720100000023220020af64a9d1f1faf501dd97d934aae2a" +
            "a3463750dc7ffc843433392d61173447b1affffffff4d0b29f52473088a0877a5d324639d11be4292e8ae7869803f57494b7e25" +
            "5083c002000023220020c07933f89277461f4aa8292c82f90f51d5c08efaf85ee0a128862ee1c1f964a0ffffffff12b0ba677d0" +
            "00000001976a9142b94a5696f8414810804910a53e0d42d469cc68888acb0693001000000001976a91449c8bc27c91b6da00814" +
            "2d59b391b71241241fe188ac4059940e0000000017a914fa671ec312a6acd9a890bfc9b8e42e6d379dd26687509731000000000" +
            "017a9140476a4bb4062634cc88efec6faa8f67367c8517687001d10000000000017a914aec4c31d0266ab952f8e333f47572419" +
            "9c1b20c08768051f000000000017a91490348215c703df48a8b5f27b6edf4e7328a8eb8f87281f54000000000017a914ed11adb" +
            "24433a7bbeb86add7b305e00a461c7060877053f0000000000017a9145c82025b4aedd1e5c1ffb9787fbee925b2b23e4e87506b" +
            "6200000000001976a9147293926f5d57e79d2fb23e45150e00f9011716b888ace86df4050000000017a914129506924b8ee99bd" +
            "fafe905f6dc8aefd5582f0387a0db5b00000000001976a9145d608186223ef77bfda8ef29eb7c118a5c49be8788ac7007bb0400" +
            "00000017a914a14e4df199b84dc7bb2e1512c2b53bb9ccc3d6ad873847bc00000000001976a9143b10f41f5bb8123f388838cac" +
            "ac30e25a1335cbb88ac20a58f05000000001976a914aa6f6e369c0ece0fa308afe230b8a090cf3dc22988ac7098940300000000" +
            "17a91428725337b726536e770d9e2ff9c42e28aa3c183e8718f55c09000000001976a914ca7369dc4f594d93b71f98e8272d41a" +
            "e4db24d3988ac90ebba00000000001976a9143981663e21bd94c88b5c1c762fb7bae44af1449b88acd1c051b80000000017a914" +
            "ac6f85e29c73fe144e9cb4df66c3918a00d03c73870400473044022061ddd2863acb41f754067891991ffa8166391156b1a179a" +
            "c2c96f03c6868224102205be713dfdf859bf73f0e298066e2b4cea8a921eae048953e4f9b08216f4f348401463043021f32be97" +
            "e483265a3cea779a3e7b418c366c87ed19c0eea0687f24f83075bc58022048a9c9264077a48b9c5e869dd483b9682cc19743ec9" +
            "0538d6be4990412729ac90169522102bf32cdf437f8af4ec8705ff9bd9d394d95dbc17d4b0801d38167a32b5af59db721027de8" +
            "616c9e0a52189ab52411b098610a996531f40b6369d066f809a0427e9bb8210268d5f41dba5d8fa19a1fde213d902f31f3513ba" +
            "56502810ba8192d33c87b1c5d53ae040047304402206c11e7f30f743d4db157cb626afbf9f22d9e87926b006ca03f1122db5a7d" +
            "a4b8022053df5a6641dee8f1513bc27a702e4c64995ed297a034a8700a5ff4f9716a383e014830450221008cb3903927db38377" +
            "ade7eae0c496084616f59ed7e0ac40df101bf2137d7368802201aa96ca4c6feba0257a780250be3addf789ed59cd772da26a680" +
            "d481386d288b0169522102127eaf8c2ffc2fcab5342b9670cd7f81fe5909a6a68e5ec48f2a4526bb055c492102ba49de2128d2a" +
            "a98525ac45183c1c9b1d4cb5b490ca2c814de2ca9e1606e9f3e21020d9cd35f18382a88e0784900763bf2bdadc54ce972a1bace" +
            "934aa366e1fde6b353ae0400483045022100ee01fec412c5fc8df06b0f7eb13666b8fd209021a14a6514b57006fca31e0dfe022" +
            "00842c2689ec7fa86428a92408bf2a10174d3611cd2b0af104b36dbc453e05a860147304402204a5c38d17e4e3e3cb4c738f983" +
            "ecc7e7ab9f8640bda8b2ae563b44d487d6fd19022025d9f523c0b6879ba06dcac11f466d345670573f016b85d550b4960ab8b7f" +
            "124016952210338e8b783d0d6d1d8b30adbd214eb0549c5f06349dad0ce1e962c25630a025b7e21029ff6bff81992bc7ee875aa" +
            "380c6d7e246c7650c2e0cb27f92e1caaa6eb362be12103e5f2e69b19cc9ffce3f466982075a9a7ff521b10ab3b7be4c55d55851" +
            "341fa7153ae040047304402206fc8313bf245c5f670b1269e6db62304715a9ea8a0eb58cb8fd0beec4a2c966102204512f61e66" +
            "46634498d74fd5ed58b25d9accc961f307888a7d3ed2366d3b46b101483045022100cc5ed821dde97f29afbad747cbef27f30d2" +
            "9d2bdf5cf6ff5bfb08964ec042487022052429189e819e1096c7a8a6a00af3b5c3d11104ff98382164bc86ed02aa2b46d016952" +
            "2102497d2370e03cef2f476c4ed98475d45d35a4ba2c6d0999d7b47af0b897fff19b210283044c82fbda2789d06b1a70afab9a4" +
            "7b8b0a6be4ffc86c778ce55400e169a48210356d36f4a13c143e122ea76b586d7d8d79ec9ef65b092471b7d1d78acefa2fb5d53" +
            "ae0400483045022100ee66c86ece64814ea61bcbbd429047361c9d4f7653e36d3f558afc088808dd4402203d96a1a87b6fe65a9" +
            "443ae2b6601531f24b7cf54058ac84273bdbbc26b60c50a014830450221008e68ad34519549184aaa549a356bb8be7bd82b9594" +
            "eda0094124c0712d262a76022040129a89f28e9656f1496b8d1ef1510ca8819133f2959d7f4eb5433fb2d024ac0169522102d58" +
            "09edd69535048caefafb7e1bbfc31dd3a8119fa027c06ac4fff7c47cc5c992102e843efa57b829404c090ec568630e04956fb70" +
            "4491433092f2e5cbe5c6ea443d2102d6ea08ba5bf4756d8926f186e8ef47ebcbf41a115b068789401aa4de0c64644953ae04004" +
            "7304402202aac4fd3456f838d62dc050066937a8627a2e7c05bc6c82713f315f3ab63c94602201477eb1ac5e54a77c3a54890f2" +
            "9728ed65d205edd376041a6ab0fdd22a37ba1b01473044022028ce2682c1abe60b1256d6fd1b76f18f39a5046d2caf2d2c8f559" +
            "d399810f71202205c3d3ec147bb4a42f945f19548fcaa4668d4c7a9b12a00724243cb2e24b9daa901695221029904a08ded0330" +
            "3a3f88d260d4c22ac71f246da63458cb6e7a5441cc9b194c6a21027dc59859ba222701fd1a582e6e58cc35d3229effc72d3f98b" +
            "9832364ac20ca13210221d250c0b6c7dad36e6af341091be754bebadaed5a5f024e5b4bbd3cf08c46e053ae0400483045022100" +
            "b2bd905daef9777adecbf52a73b64eca6475401bf1a5e9a392b1858315a09897022053f44b586eaba0c58b6629e6ff047e237b3" +
            "38483c13980bc3caf9e3ed69b14e001483045022100dcdc4edf79acacdda43ffbc3f585572013ab331b237bf04798874b4cca4e" +
            "4801022042fb1b77e48acb3c7047ba020443e611d760d2b6cc544bf721d3dabf2e3fa3d201695221036bcd992017b6613195d33" +
            "ad328d9ea158b3f55a21f1fffffe31b31771f75f3f12103244b19fb816b23fa2292eb552f2e9877c0f409386d34fa93c11e9cf7" +
            "c9f70308210292a9db72e379443012a33e832c89dbe34dfa521686466451ce3d320885ce8f4153ae04004830450221009987ece" +
            "026511cf9afdd46d1de4bde25d55c2b4c82a761cedfce656cc6fc55f9022038e99c9607b131110c25363a366ce3724a796b2df2" +
            "01ba71d74b3debef7062c301483045022100ed38faf5ab45cde2621f63bc08670dc4e4c33cb8117a488764fd77ab45a2c485022" +
            "0792b72f562c0d21d5f697f760267410e3e41203455faef3c73519b32abd26e7401695221023c4ea281bbf7d5edbda342ef63a2" +
            "10bd4f29491d4132850233b84b8e8d00d12521021f69d49af87b294f22dc1093f4b83dc640e5731f8e4cea2788e9f610eb86c31" +
            "c21023e1110e93cb0f47e22be40fedbcc0a44411f1167817cde6c55c8dc21c039ed1e53ae0400463043021f689bb6058b3e2b5d" +
            "b0f83c53291e090dbd653ad64c7dc967fd3b88fed201ef022010db0c1741b9dcd8da21fce909e2753125b96e43da5fa6c3e4aba" +
            "b4834648c3a0147304402206dd1c33cfa870f865bf62690cb99ac059171c59753942b47c64989df0fd9f52d022001e057a08bc5" +
            "aa22260508424f1b3fa67fad3e365b67c27aeb8c592946b671930169522102add3216135f7e64cf4f391b3930bf36a18ae63cdb" +
            "7d2df49caaf1454975c757621036f5fcbd63200e086629e21f2e22cadcb4164a4cc3c889ed575a5ca7530c21a622102df9a83c1" +
            "5a3cd69a2f1787cbbfc41da8557268dec6e37d0647838ed4fde79adf53ae04004730440220389b3a4b11682a43524d10623e870" +
            "7303533dd772f063e39cc07660e0b31472c02206732c70619ee40f0af5fb7add47a3aa8b7cc7aa9d6df5344803c8d48e1cfc2bb" +
            "01483045022100df530268f3c9f243a89e22ef6f24bc80ae6642b483598d7ee0a6b4b79f2a8b9a02207fb4ec71b84df08d97fd0" +
            "87b8e15e8107cf7c9e63f1961ec96c9aa33a88c43910169522102a8c6438e2f6ec0c5702b55c5f1ea54f9356dc999a9c035c0f0" +
            "443a54d124c3262103e06283c613593286b3bffae9a3d5b890fe225617481d7e6572fadfc38513345b2103cd7fcf98e0640739a" +
            "298165e72bad79cbb3434d74649ab3a064d8631cf93f96c53ae00000000";

            tx = new Transaction({rawTx: t});
            equal(t, tx.serialize());
        });

        it('sign P2SH_MULTISIG 1 of 2', () => {
            let a1 = new Address("cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn", {testnet: true});
            let a2 = new Address("cR3oXD6J1tDr2LhT6mKJYJc9qT2iv1dtpFLKkfR7qKnTC3P85w5T", {testnet: 1});
            let a = ScriptAddress.multisig(1, 2, [a1, a2], {testnet: true, witnessVersion: null});
            equal(a.address, "2MtBHb92gNV93Wd6wAiyrV4bBQbbnZspvUA");
            equal(a.scriptHex, "51210399179539f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba8" +
                "1f9863ffdc06ea551467a49e290760d47ed547ea71544a9b8d10ad52ae");
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "6bff4e558bdfb9cf12ac1865a2895ea270b64e836520a7404aedab1478d4b85f", vOut: 0,
                address: "2MtBHb92gNV93Wd6wAiyrV4bBQbbnZspvUA", redeemScript: a.script});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn",
                sigHashType: SIGHASH_ALL});
            let t = "01000000015fb8d47814abed4a40a72065834eb670a25e89a26518ac12cfb9df8b554eff6b00000000920048304502210" +
            "08e7edc6f3fec3d2eb029e68f9340ad0549e24cd6e50e99b33a8f64bae42e44bd02207189c4f1088466754766b76ad731" +
            "3d96b34989769268c4b8cf461f4a6022bf44014751210399179539f1ebedc809887a48fe802093a74435052ab7fb83d58" +
            "61fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e290760d47ed547ea71544a9b8d10ad52aeffffffff0100" +
            "0e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";
            equal(t, tx.serialize());
        });

        it('sign P2SH_MULTISIG 2 of 2', () => {
            let a1 = new Address("cQMtVcE77xqLAAJGPxoQX4ZxnvBxBitBMMQQr5RMBYh4K8kZDswn", {testnet: true});
            let a2 = new Address("cR3oXD6J1tDr2LhT6mKJYJc9qT2iv1dtpFLKkfR7qKnTC3P85w5T", {testnet: 1});
            let a =  ScriptAddress.multisig(2, 2, [a1, a2], {testnet: true, witnessVersion: null});
            equal(a.address, "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25");
            equal(a.scriptHex, "52210399179539f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ff" +
                "dc06ea551467a49e290760d47ed547ea71544a9b8d10ad52ae");
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "cf43acc2202074d3bf3f5a8936ef0157e6e292e1e53dd3eb6f5644de237b5d89", vOut: 0,
                address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey]});
            let t = "0100000001895d7b23de44566febd33de5e192e2e65701ef36895a3fbfd3742020c2ac43cf00000000db00483045022100" +
                "a52f86f21a4b189cd172b2c6267149f15d9c02c7ac7cf72eb31d3c5fa475465e02203293d8683376c1574125f7fd36b75d" +
                "770c5c2930d148221aee3123f9c9fd158c01483045022100c1e19c1da2776cea4d57fe0221f34ec3a38719260633cdce96" +
                "def65eb79d6554022050738953714493d18e155750ffd9f2697381b618e74a1b82b5bf0e8c58a6b13f0147522103991795" +
                "39f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e29" +
                "0760d47ed547ea71544a9b8d10ad52aeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a022" +
                "1da3b45f88ac00000000";
            equal(t, tx.serialize());

            t = "0100000001762a9a00d64c693795013b5ea5246e5407f37f4d5477f7839c857cea92e7f6d600000000da00483045022100" +
            "8da9cfb8b89c0374f9db6f5066115bc2a8cba54de67486bc09aaa5fdda92b559022057456f63dac1a9ede532e7e7659518" +
            "d0447229533470e0647baf1cab99b7986e01473044022042aefa2ff6c682e0a88ef421540a0b38422c45b182a9660d253c" +
            "9167dcaedea702202e4b2c2dba6d603b7d2024f0c4cbdeb8fe2f457c70c423d98f4f091ff48e6417014752210399179539" +
            "f1ebedc809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e2907" +
            "60d47ed547ea71544a9b8d10ad52aeffffffff010090d003000000001976a9145bfbbcfef367417bd85a5d51ae68a0221d" +
            "a3b45f88ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "d6f6e792ea7c859c83f777544d7ff307546e24a55e3b019537694cd6009a2a76",
                address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
            tx.addOutput({value: 64000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey]});
            equal(t, tx.serialize());

            // swap key order
            tx = new Transaction({testnet: true});
            tx.addInput({txId: "d6f6e792ea7c859c83f777544d7ff307546e24a55e3b019537694cd6009a2a76",
                address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
            tx.addOutput({value: 64000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a2.privateKey, a1.privateKey]});
            equal(t, tx.serialize());

            // sign Alice and Bob

            t = "0100000001b280dd126d2cafe8aa0e26b7360d5c6c51446b82e934c0b98f9e77318711243c00000000d9004730440220157" +
            "1a0d54361d7d6838c95263f6a4a8ee1f7315c0c2c57a7bf095716535d040602203ae9be582f6112eb45ac1b7388316b740e" +
            "2a6f0de24c640f5d00bda131c471a20147304402205758aa63e4ff3c5fdb4a4d32ddde90f851dfd3ff889e77c9ecb9af3cd" +
            "345360202207443b94ddddfc337a8b4812267a29b489e53c8a76f28158a70ed4d71c60039bb014752210399179539f1ebed" +
            "c809887a48fe802093a74435052ab7fb83d5861fca2f4582e22103d595ee4ba81f9863ffdc06ea551467a49e290760d47ed" +
            "547ea71544a9b8d10ad52aeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88" +
            "ac00000000";

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "3c24118731779e8fb9c034e9826b44516c5c0d36b7260eaae8af2c6d12dd80b2",
                address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});

            // Alice sign first
            tx.signInput(0, {privateKey: [a1.privateKey]});
            let rtx = tx.serialize();
            // Alice send half signed tx to Bob
            // Bob in play
            tx = new Transaction({rawTx: rtx, testnet: true});
            tx.signInput(0, {privateKey: [a2.privateKey], address: a.address, redeemScript: a.script});
            equal(t, tx.serialize());


            tx = new Transaction({testnet: true});
            tx.addInput({txId: "3c24118731779e8fb9c034e9826b44516c5c0d36b7260eaae8af2c6d12dd80b2",
                address: "2MxgNabrhi6kGzNCapEwnk7GYkNmDZGHr25", redeemScript: a.script});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});

            // Bob sign first
            tx.signInput(0, {privateKey: a2.privateKey});
            rtx = tx.serialize();
            // Bob send half signed tx to Alice
            // Alice in play
            tx = new Transaction({rawTx: rtx, testnet: true});
            tx.signInput(0, {privateKey: a1.privateKey, address: a.address, redeemScript: a.script});
            equal(t, tx.serialize());
        });

        it('sign P2SH_MULTISIG 4-10 of 15 step by step', () => {
            let t  = "01000000011c5dbac1a4028badbe2ec11db09682dbd9869e97cb9f9d4e83e5e169c25b1fcd00000000fd280300483045" +
                 "0221008f649de02eb599f1c6b24a4719e85961f0c8b7b1e5fed544ea9afc03ff55f0410220494e49c7d7193ef7845475" +
                 "92917005ab7bfa947f7c29bdfe869296d603ca1ba20147304402200ec9f3cb352a94a6df1227ff9c1b4236cf1a718d21" +
                 "89591001935142d2a02bf5022069f48bcdbd2b9f9ecf0ce4170231aeb485264c7bfca86dd937c5840be7613a7d014830" +
                 "45022100cb28f2d1ee5d1776d9f36dd07e7b76e86225ecc35088b02937cc7cf091cc10e402202617d6cb66a977dc2ee8" +
                 "c58d3efd941dce595a7acc9ff9fdf374838a291b745b014830450221008d6e0f1d328e79ee93de4c31ffded81ecdbbe7" +
                 "aa5c9a92949de91ef192a3e085022079de8336edf917d44030dc6428a4b6dc6d7991cc0b7844df01e38973eb16d68a01" +
                 "4d0102542103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05a" +
                 "af8443e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525" +
                 "235c42f2cbcd8c17c6da21022388ccac4ff254b83e58f5013f86162fab940e4718d3bfede2622eb1aaa76ec721032d60" +
                 "0f6d14d9d0014122ecb5ccba862da9842b68f71905652087138226a2b37921031963d545c640fed2400c6af7332ba9fd" +
                 "06cdee09b72ae5fbff61a450340918492103bfebbdc81e1fd9ef1f1f04e53bd484298fb7381211cacb0dc46b33453102" +
                 "4a7e210356399488ae0f1e13e8eef8b88b291e51f89041d9bf00acbaa5dfda4894f3c3952102c40b66c4671bc5ee03fc" +
                 "22e84922ac7f2f8e063ee45628d28bb68ca38dc583d121023997c4745467ce88b747849191404b4fdb27323bbbc6e7e5" +
                 "1cf63d22ba87015e21033add032f5d77c74c19d8dbe89c611917e263844974b13bc518817bc36f60afaf2102cfc901fd" +
                 "07b9e187fea1842c68eb0ce319aea7fa4807abea7b7d3239a2dd64702102e94f4d60ee1912af627fdb5cf5650210af97" +
                 "3c573a136e873da4816828fffcc02102576df3e588f34f592239a4b86d59e4cc0116b8f1b102cf36edf631a09c0ca963" +
                 "2103b4bc5d45ed8219248cf1b62210b6c0ce71d86bb95b35d2e2a3cf456c483bac425faeffffffff01000e2707000000" +
                 "001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac00000000";

            let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt", {addressType: "P2PKH", testnet: true});
            let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX", {addressType: "P2PKH", testnet: true});
            let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH", {addressType: "P2PKH", testnet: true});
            let a4 = new Address("cU6Av8QXbHH9diQJ63tSsrtPehQqCcJY6kEHF5UgrsSURChfiXq4", {addressType: "P2PKH", testnet: true});
            let a5 = new Address("cT35A2N2m1UPSGXuAHm4xZPhfYMUREVqyKe6f1jJvugk2wsMefoi", {addressType: "P2PKH", testnet: true});
            let a6 = new Address("cSGyUSV57VtJVRsobrG1nAmZpg9xZQ5eUcQnVvEmDH4VLwq4XwxX", {addressType: "P2PKH", testnet: true});
            let a7 = new Address("cNhEs9VxjbxKuvfunmhnQPNSgTLCzwT339iP75r9UmhLNriL3R2i", {addressType: "P2PKH", testnet: true});
            let a8 = new Address("cNEaZTTsHcVUYdrE8cRtqLJGdkGk3oghE9ZS6Zeb9y1T92rggKiT", {addressType: "P2PKH", testnet: true});
            let a9 = new Address("cUwC2prwKErK7VB7VW1wybE4cjvvyPvUDXFGtNQeinM2sKmGxpGX", {addressType: "P2PKH", testnet: true});
            let a10 = new Address("cVb6Jm2WJGWh9GDbRxtQ7KSsavqvGujhLYn29e6YQH12TaB49eXN", {addressType: "P2PKH", testnet: true});
            let a11 = new Address("cV8tWtYmaxqoqZnYFthA5xizAK7AM4Tm2dnnFBRHLhTw4TA2QfJb", {addressType: "P2PKH", testnet: true});
            let a12 = new Address("cP3zQV2ozq2pEUtFRapnPyhwTisbCug8QjwcuWMTdPLDAM5J4nMH", {addressType: "P2PKH", testnet: true});
            let a13 = new Address("cPyKxfC98PhMjsSS43B43YqHmcUv18XeMyfeUNdy3iPokzW9T911", {addressType: "P2PKH", testnet: true});
            let a14 = new Address("cUpMmtD81KTB9hHZ4YzGkMtghMh3pQxfKXTrApAyD6nVZWPHwE46", {addressType: "P2PKH", testnet: true});
            let a15 = new Address("cRh1T62pjkUGh6NKEEsKJ87Korbp1rw2GNxdzwmcPk5dUzn36aRy", {addressType: "P2PKH", testnet: true});

            let a = ScriptAddress.multisig(4, 15, [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15],
                {testnet: true, witnessVersion: null});
            equal(a.address, "2Mz8kUcHia2SYBe4dNYF7uKZcDWy7DHU3pZ");

            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "cd1f5bc269e1e5834e9d9fcb979e86d9db8296b01dc12ebead8b02a4c1ba5d1c"});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a1.privateKey, a9.privateKey], redeemScript: a.script, witnessVersion: null});

            let rtx = tx.serialize();

            tx = new Transaction({rawTx: rtx, testnet: true});
            tx.signInput(0, {privateKey: a3.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();

            tx = new Transaction({rawTx: rtx, testnet: true});
            tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
            equal(t, tx.serialize());

            t = "0100000001967232c948bafa80eafc9459b2b7c2738cc87d14d7a1a3c980696389897da69700000000fd430600473044" +
                 "0220696ad6a6ba02a3b0db932249c4e37d0462da11b3978b305c7af47e8f3af79dc5022049c14881f912502243028498" +
                 "1ef1ba5b4e27cd4bc93767acb89e6329be7d0ddf0147304402200aae39bfa42043cfde4994610d5e193ff356a127ccba" +
                 "317c3f25ef00c47ee5e602200f58ead8e69cfb5642924a891452eb8e166d868aa93fedc62d005b6f04bd1e9a01473044" +
                 "02200a2953e9eec39d147f013d63320bf9ae272536794fba8719dd0dcb7b1efaa49102203ee41f5264737352727bccd7" +
                 "6a32fecf3f56f66962dfa690d742361a327331db01483045022100ac93a6dcf823ea67489b58483618a5c878a8e18f08" +
                 "9bd4ed9c0cf416207e855a022018f4dfafa887581bd466a0bb4cf6fa0ae984c7f3451c2bfc12673a9e5151df1a014830" +
                 "45022100f3f42ac1e0384d317447cc34c5583f1ac56b3e18b057b2e971e9736ad389dc7e022042fc92864136bd37f26c" +
                 "7e9e1f96b7ac79d4ac98ab9250a03e97cb0843b1b03701483045022100f6f420c77fae5e6eb7830727886e861596d755" +
                 "97db5ea7351c0926b512f4402502204eb1c1958d627dbe7733f4ff6a1f3a5d531841db5ec9c955f414ec665b4c894101" +
                 "47304402205004b556afb3ec48081938ef62b9b1c97bf71320c235a5d39d1aab3adb79545502203da05cbddab322c555" +
                 "d8664dbf552adbac2fb59a0dc58f26cd080d64d2864a4a0147304402203da589e72cd1e7b1855ef9a545928c68b4ac1d" +
                 "8bc05a5d25c60a29e1ed790ae702201400f3adcb3ac6dd45ba2002c1966cb14268d80afadb231b20eafdfeecf0bcbf01" +
                 "483045022100fedb21c44371aa838c293596716399de122d03100ef2e828cfee5c1b8d841ab0022008cdf3d89abc5fef" +
                 "2eaf88f96bedeac27df352f4e03db2fbcb247d642a9bd60e0147304402202b0872bfd3b28a7b0fc87e6d929b46efde32" +
                 "d97d0029f66f93d2a5bbe287bcd60220131e082881fa1dc7c83c715ea936f03fefe2d5b87b630f5b818049aecdb9a1bb" +
                 "01483045022100c1d9c33a0df2caa7ace6293e35dc91d9c863ae0dc7ccc315ca0a1fc33151981802203ca9c47e70c92b" +
                 "1ef9fdcc28321ec96ccf18feec60bd2054ad4510d5872a6af7014730440220168e5b03e8f55bb46fb3329420c5c8aa55" +
                 "1c1b77f1c23c585a3ea4127c2e508d022062c7745f038c83cad56f0c97afac0a7aabb56403e22b35fe45cad31227d149" +
                 "e50148304502210088bac04a079105467d1fe38da55b1b116f586af87d09dc227024b4da0089d2b902204fd087024da0" +
                 "a731a9f0f03ada61634670511de9b093d312d30c5627a4dcde44014730440220354ea1d887596083196bdcde56a0de99" +
                 "d9d927802c6723544b219134809a1e2502202104071d382689bf0b75549f90ba65d28b1f733c38e783d977a17a107d81" +
                 "365e0147304402202916e12169c5487dc650d5ed774568623e366ab278ccffd860ce9b18a6a6d7a1022047ceee8dd9ff" +
                 "dd1f16ceae2574113adbbcdbb228699079762b44ad427fd68864014d01025f2103b4603330291721c0a8e9cae65124a7" +
                 "099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05aaf8443e3810483d5dbcf671512d9999f9c9772b0ce" +
                 "9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525235c42f2cbcd8c17c6da21022388ccac4ff254b83e" +
                 "58f5013f86162fab940e4718d3bfede2622eb1aaa76ec721032d600f6d14d9d0014122ecb5ccba862da9842b68f71905" +
                 "652087138226a2b37921031963d545c640fed2400c6af7332ba9fd06cdee09b72ae5fbff61a450340918492103bfebbd" +
                 "c81e1fd9ef1f1f04e53bd484298fb7381211cacb0dc46b334531024a7e210356399488ae0f1e13e8eef8b88b291e51f8" +
                 "9041d9bf00acbaa5dfda4894f3c3952102c40b66c4671bc5ee03fc22e84922ac7f2f8e063ee45628d28bb68ca38dc583" +
                 "d121023997c4745467ce88b747849191404b4fdb27323bbbc6e7e51cf63d22ba87015e21033add032f5d77c74c19d8db" +
                 "e89c611917e263844974b13bc518817bc36f60afaf2102cfc901fd07b9e187fea1842c68eb0ce319aea7fa4807abea7b" +
                 "7d3239a2dd64702102e94f4d60ee1912af627fdb5cf5650210af973c573a136e873da4816828fffcc02102576df3e588" +
                 "f34f592239a4b86d59e4cc0116b8f1b102cf36edf631a09c0ca9632103b4bc5d45ed8219248cf1b62210b6c0ce71d86b" +
                 "b95b35d2e2a3cf456c483bac425faeffffffff01000e2707000000001976a9145bfbbcfef367417bd85a5d51ae68a022" +
                 "1da3b45f88ac00000000";

            a = ScriptAddress.multisig(15, 15, [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15],
                {testnet: true, witnessVersion: null});

            equal(a.address, "2N5Z12YFKCzmk8jJKxRQG48ZeAo9fdMFXt6");
            tx = new Transaction({testnet: 1});
            tx.addInput({txId: "97a67d8989636980c9a3a1d7147dc88c73c2b7b25994fcea80faba48c9327296"});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a1.privateKey, a2.privateKey, a3.privateKey],
                redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();

            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a4.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a5.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a6.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a7.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a8.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a9.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a10.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a11.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a12.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a13.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a14.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
            equal(t, tx.serialize());

            // same tx random sign order
            tx = new Transaction({testnet: 1});
            tx.addInput({txId: "97a67d8989636980c9a3a1d7147dc88c73c2b7b25994fcea80faba48c9327296"});
            tx.addOutput({value: 120000000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: [a8.privateKey, a2.privateKey, a13.privateKey],
                redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a1.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a5.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a15.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a7.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a10.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a9.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a12.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a11.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a14.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a3.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a6.privateKey, redeemScript: a.script, witnessVersion: null});
            rtx = tx.serialize();
            tx = new Transaction({rawTx: rtx, testnet: 1});
            tx.signInput(0, {privateKey: a4.privateKey, redeemScript: a.script, witnessVersion: null});
            equal(t, tx.serialize());
        });

        it('sign P2SH_P2WPKH', () => {
            let rtx = "0100000001db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000000feffffff02b8b4eb0" +
             "b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d96388ac0008af2f000000001976a914fd270b1ee6abcaea" +
             "97fea7ad0402e8bd8ad6d77c88ac92040000";
            let tx = new Transaction({rawTx: rtx});
            tx.signInput(0, {privateKey: "eb696a065ef48a2192da5b28b694f87544b30fae8327c4510137a922f32c6dcf",
                redeemScript: "001479091972186c449eb1ded22b78e40d009bdf0089",
                value: 1000000000, witnessVersion: null});
            rtx = "01000000000101db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000017160014790919721" +
            "86c449eb1ded22b78e40d009bdf0089feffffff02b8b4eb0b000000001976a914a457b684d7f0d539a46a45bbc043f35b59d0d9" +
            "6388ac0008af2f000000001976a914fd270b1ee6abcaea97fea7ad0402e8bd8ad6d77c88ac02473044022047ac8e878352d3ebb" +
            "de1c94ce3a10d057c24175747116f8288e5d794d12d482f0220217f36a485cae903c713331d877c1f64677e3622ad4010726870" +
            "540656fe9dcb012103ad1d8e89212f0b92c74d23bb710c00662ad1470198ac48c43f7d6f93a2a2687392040000";
            equal(rtx, tx.serialize());
        });

        it('sign P2WPKH', () => {
            let rtx = "01000000000101d7592de6f96f49ad6b66a718c5ea8d7e4c5a7198b7a9b904687b6e23b553b1b20000000000ffffffff01c027" +
            "0900000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac02483045022100888e7a282b18461cfca7af6d" +
            "6c33a75c0d19ad890697c56e4873763f4a07a7bd022041bfedfca7604f695109ea520337dce8eb9f6531c3f860e950a72c94ef" +
            "42672a01210377e4cd2648a68ec815e8df2fa4470101d1e8605245bb14e107a77335ddc0877800000000";
            let a = new Address("cRZQF3fuaKZy2ivDJF9rCmL1h7VYhdhucQE6Vv6ZVbZYpjnDENur");
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "b2b153b5236e7b6804b9a9b798715a4c7e8deac518a7666bad496ff9e62d59d7",
                address: "tb1qksk0dunzsmpygj9jf37j77emkamn86g3g9vz00"});
            tx.addOutput({value: 600000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cRZQF3fuaKZy2ivDJF9rCmL1h7VYhdhucQE6Vv6ZVbZYpjnDENur",
                sigHashType: SIGHASH_ALL, value: 700000});
            equal(rtx, tx.serialize());
        });

        it('sign P2WSH MULTISIG', () => {
            let rtx = "010000000001018aea147516fb825c06e26c4a0fe7cbfe6a280c3e5c215e616def5741970f45160000000000ffffffff01c0270" +
            "900000000001976a9145bfbbcfef367417bd85a5d51ae68a0221da3b45f88ac0300483045022100df55ebb3874fee1a5993162f" +
            "22ab8484faf278b32340f1ccc43cd4ef60926d64022029522a37d65968b6b80090abf6beaa2d5b6a416b8a5cdc9ceb13e6b6997" +
            "9ed9a0169512103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2ec7de7e811c05aaf84" +
            "43e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3600716b981d101cf0a000ab3524525235c42f2cbc" +
            "d8c17c6da53ae00000000";

            let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt", {addressType: 'P2PKH', testnet: true});
            let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX", {addressType: 'P2PKH', testnet: true});
            let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH", {addressType: 'P2PKH', testnet: true});
            let a = ScriptAddress.multisig(1, 3, [a1, a2, a3], {testnet: true});
            equal(a.address, "tb1qcmdwjnv7yv6csp3ft8xw06jzvkzgl8xvjv5wdn85nefqpq3m29rst82pm2");
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "16450f974157ef6d615e215c3e0c286afecbe70f4a6ce2065c82fb167514ea8a"});
            tx.addOutput({value: 600000, address: "mouKMbHPwWLUCmgqKnkHT7PR3KdF4CNREh"});
            tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                redeemScript: a.script, value: 700000});
            equal(rtx, tx.serialize());

        });

        it('sign P2SH P2WSH MULTISIG', () => {
            let rtx = "010000000136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000000ffffffff0200e9a4350" +
            "00000001976a914389ffce9cd9ae88dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e" +
            "6e84c138dbbd3c3ee41588ac00000000";

            let redeem = "56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658" +
                 "ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195" +
                 "f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba0" +
                 "4d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9" +
                 "f0c19617681024306b56ae";

            let tx = new Transaction({rawTx: rtx});
            tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
            tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
            tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
            tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});

            let r =  "0100000000010136641869ca081e70f394c6948e8af409e18b619df2ed74aa106c1ca29787b96e0100000023220020a16b5755f" +
            "7f6f96dbd65f5f0d6ab9418b89af4b1f14a1bb8a09062c35f0dcb54ffffffff0200e9a435000000001976a914389ffce9cd9ae8" +
            "8dcc0631e88a821ffdbe9bfe2688acc0832f05000000001976a9147480a33f950689af511e6e84c138dbbd3c3ee41588ac08004" +
            "7304402206ac44d672dac41f9b00e28f4df20c52eeb087207e8d758d76d92c6fab3b73e2b0220367750dbbe19290069cba53d09" +
            "6f44530e4f98acaa594810388cf7409a1870ce01473044022068c7946a43232757cbdf9176f009a928e1cd9a1a8c212f15c1e11" +
            "ac9f2925d9002205b75f937ff2f9f3c1246e547e54f62e027f64eefa2695578cc6432cdabce271502473044022059ebf56d9801" +
            "0a932cf8ecfec54c48e6139ed6adb0728c09cbe1e4fa0915302e022007cd986c8fa870ff5d2b3a89139c9fe7e499259875357e2" +
            "0fcbb15571c76795403483045022100fbefd94bd0a488d50b79102b5dad4ab6ced30c4069f1eaa69a4b5a763414067e02203156" +
            "c6a5c9cf88f91265f5a942e96213afae16d83321c8b31bb342142a14d16381483045022100a5263ea0553ba89221984bd7f0b13" +
            "613db16e7a70c549a86de0cc0444141a407022005c360ef0ae5a5d4f9f2f87a56c1546cc8268cab08c73501d6b3be2e1e1a8a08" +
            "824730440220525406a1482936d5a21888260dc165497a90a15669636d8edca6b9fe490d309c022032af0c646a34a44d1f4576b" +
            "f6a4a74b67940f8faa84c7df9abe12a01a11e2b4783cf56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99" +
            "a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761" +
            "b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de746831239" +
            "87e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b" +
            "09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae00000000";
            equal(r, tx.serialize());

            // sign same P2SH-P2WSH-MULTISIG random sign order
            tx = new Transaction({rawTx: rtx});
            tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
            tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
            tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
            equal(r, tx.serialize());

            //  sign same P2SH-P2WSH-MULTISIG random sign order with raw Transaction representation
            tx = new Transaction({rawTx: rtx, format: "raw"});
            tx.signInput(0, {privateKey: "428a7aee9f0c2af0cd19af3cf1c78149951ea528726989b2e83e4778d2c3f890",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "730fff80e1413068a05b57d6a58261f07551163369787f349438ea38ca80fac6",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true});
            tx.signInput(0, {privateKey: "fe9a95c19eef81dde2b95c1284ef39be497d128e2aa46916fb02d552485e0323",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_NONE | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "14af36970f5025ea3e8b5542c0f8ebe7763e674838d08808896b63c3351ffe49",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true,
                sigHashType: SIGHASH_ALL | SIGHASH_ANYONECANPAY});
            tx.signInput(0, {privateKey: "11fa3d25a17cbc22b29c44a484ba552b5a53149d106d3d853e22fdd05a2d8bb3",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_NONE});
            tx.signInput(0, {privateKey: "77bf4141a87d55bdd7f3cd0bdccf6e9e642935fec45f2f30047be7b799120661",
                redeemScript: redeem, value: 987654321, p2sh_p2wsh: true, sigHashType: SIGHASH_SINGLE});
        });

        it('sign BARE MULTISIG', () => {
            let a1 = new Address("cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                {addressType: "P2PKH", testnet: true});

            let a2 = new Address("cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX",
                {addressType: "P2PKH", testnet: true});
            let a3 = new Address("cQWBhFENcN8bKEBsUHvpCyCfWVHDLfn1M65Gd6nenQkpEqL4DNUH",
                {addressType: "P2PKH", testnet: true});
            let script = Buffer.concat([Buffer.from([OPCODE.OP_2]),
                                        opPushData(a1.publicKey.key),
                                        opPushData(a2.publicKey.key),
                                        opPushData(a3.publicKey.key),
                                        Buffer.from([OPCODE.OP_3]),
                                        Buffer.from([OPCODE.OP_CHECKMULTISIG])]);
            equal(a1.address, "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt");
            // create funding transaction for bare multisig
            // https://tbtc.bitaps.com/cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068
            let tx = new Transaction({testnet: true});
            tx.addInput({txId: "d791f8386516bc464e7702159775734559d884a3fd50e45191c6207cdedac8ae"});
            tx.addOutput({value: 64000000, scriptPubKey: script});
            tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
            let rtx =  "0100000001aec8dade7c20c69151e450fda384d859457375971502774e46bc166538f891d7000000" +
                                 "006a47304402200edb1ded443ea8015390c38afeb0564b52f6f9895c45952461f6ccfaf6639b8402" +
                                 "206c0d3bfd2f7d8c68d5cc3c774a9403d843cd27e33148927e3f575607b91d05c2012103b4603330" +
                                 "291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cbffffffff010090d003000000" +
                                 "0069522103b4603330291721c0a8e9cae65124a7099ecf0df3b46921d0e30c4220597702cb2102b2" +
                                 "ec7de7e811c05aaf8443e3810483d5dbcf671512d9999f9c9772b0ce9da47a2102c711ad61c9fbd3" +
                                 "600716b981d101cf0a000ab3524525235c42f2cbcd8c17c6da53ae00000000";
            equal(tx.serialize(), rtx);

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
            tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
            tx.signInput(0, {privateKey: ["cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                    "cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"], scriptPubKey: script});
            let t = "0100000001680059981784856428af42541fbb9c36f26a2e9eddb2260a40e29005d202e" +
            "0cf000000009300483045022100a7383d84ee35fb965978144d9243ca0892a1be81ce70" +
            "058e70b2ba1ea5a762a7022058647d131fcec2e3a63e57fa475b779b94c81a95b5c164f" +
            "dfdbcee0124e3448c01483045022100b3945861a5a8a406bd575857e19accdb0f6385eb" +
            "f1c02938b35462cddeef400802205857f56d83e9ed7e98082d9127b8934262d3a046142" +
            "9747e865b06345bbf8f9e01ffffffff01c04dc103000000001976a914ad204de226b3d1" +
            "1a70dc53b4998f4603e138ff3f88ac00000000";
            equal(tx.serialize(), t);

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
            tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
            tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                scriptPubKey: script});
            tx.signInput(0, {privateKey: ["cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"],
                scriptPubKey: script});
            equal(tx.serialize(), t);

            tx = new Transaction({testnet: true});
            tx.addInput({txId: "cfe002d20590e2400a26b2dd9e2e6af2369cbb1f5442af286485841798590068"});
            tx.addOutput({value: 63000000, address: "mwJMtn5hW54pJC748EExvhRm6FRVmUZXQt"});
            tx.signInput(0, {privateKey: ["cVgShyj2q4YKFX8VzCffuQcrJVYhp522NFozNi7ih2KgNVbnysKX"],
                scriptPubKey: script});
            tx.signInput(0, {privateKey: "cPBuqn4ZsddXunx6EEev6khbfUzFnh3xxdEUPCrm5uy9qGcmbBEt",
                scriptPubKey: script});
            equal(tx.serialize(), t);

        });
    });


    describe("Wallet class:", function () {
        it('Wallet from master xPriv key', async () => {
            let w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.accountXPrivateKey, "xprv9xy9pW6QriePuzgpsBLoRjSE5ZhzVpdkPNF4377deALRSQ4RJRfBDvfz2XuqHNYSHy175udJTUodKeYWusgqbK4sTuhb1EoB1mcWzKFQR4u");
            equal(w.accountXPublicKey, "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk");
            equal(w.externalChainXPrivateKey, "xprvA1LwXrHHrvp1QRhKRBkG82YoUKZmsmn887gH7fhgWYSc135bSdDdU7rhe73pkc95S24kL88vTXdQyjyNzAETQWkU2SBXn7zqJQgZgAvosx1");
            equal(w.externalChainXPublicKey, "xpub6ELHwMpBhJNJcumnXDHGVAVY2MQGHEVyVLbsv47J4syasqQjzAXt1vBBVN8s1jxTKniP4NypmswJBsGK1PQQ49WvvrDNUtHYN8h9SX24nuV");
            equal(w.internalChainXPrivateKey, "xprvA1LwXrHHrvp1Ub1i8zPEd7WPqmnbmd8K2dXihAqmdew6FaMSLMGdStw3UwjFsXYtngpoJoK4CwzV8GEBpCxDQeA54pY2XEy55qHVqWhWpDi");
            equal(w.internalChainXPublicKey, "xpub6ELHwMpBhJNJh56BF1vEzFT8Pod6B5rAPrTKVZFPBzU58NgastaszhFXLBchcsuNwTZLrVgcAJGvrHRQBA33B3UcbRqWwYg3AVhVn7MoCzv");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 0);
            w = new Wallet({from: "yprvABrGsX5C9jantnJDGKVwXWL5MWpqhaDPDrYX2xYCq6BMZSu2tN8DiZ9TXpU8ssQhYe1WRwZ9RDR8gMxndVp3yCeMRaZ7kSwbD6jPaq7NqCU",});
            equal(w.masterXPrivateKey, "yprvABrGsX5C9jantnJDGKVwXWL5MWpqhaDPDrYX2xYCq6BMZSu2tN8DiZ9TXpU8ssQhYe1WRwZ9RDR8gMxndVp3yCeMRaZ7kSwbD6jPaq7NqCU");
            equal(w.accountXPrivateKey, "yprvAKNoUVXZ3WtAnEuayKC5MnMSVvLqAjcrWb5n4FB5Mp5QHv2nQrFDNj8nAwx5kgiNPEZVgJmJhCK24axgrvH47oFSMzeB2E1jP9wtYYt4k55");
            equal(w.accountXPublicKey, "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6");
            equal(w.externalChainXPrivateKey, "yprvAKfNZUdQw7jVb7mt1b6CCE6b4VCwU35yW5DesrvBLJZhejkg1k6fnJhr4vrzcknzooULNWwGxi8eMgB6susaX4RiXfr7SU4tAd3yvy2rmag");
            equal(w.externalChainXPublicKey, "ypub6YeixzAJmVHnobrM7cdCZN3KcX3RsVopsJ9FgFKnte6gXY5pZHQvL72KvCjRBxdAzXsQaii7CcPTooRrKeNDMe1fVaD3Z8DGinm58vgNV2z");
            equal(w.internalChainXPrivateKey, "yprvAKfNZUdQw7jVdSM6BKgtELaDfCrhRgzHxFvnAfH26LxoE9jYYfybQGruxS2NezefRyEeH2s7oaj3LDarxRuqgQcPE5GHfZD6GgKLfWXaYvp");
            equal(w.internalChainXPublicKey, "ypub6YeixzAJmVHnqvRZHMDtbUWxDEhBq9i9KUrNy3gdegVn6x4h6DHqx5BPoisYumVWgsM5f3ByH6bRVaLvJRfFKczg2QnRYBhWDEsQS7X8N73");
            equal(w.path, "m/49'/0'/0'/0");
            equal(w.pathType, "BIP49");
            equal(w.depth, 0);

            w = new Wallet({from: "zprvAWgYBBk7JR8Gk5VL6gHZjbRaXUyHeCCt8y4jpMS6D6ZEcYiG92HnLcobZ2Risn4cxH8KBR9hssmgZeaMMCE4mSKxHvFYLMm5Upo2yQjkycx",});
            equal(w.masterXPrivateKey, "zprvAWgYBBk7JR8Gk5VL6gHZjbRaXUyHeCCt8y4jpMS6D6ZEcYiG92HnLcobZ2Risn4cxH8KBR9hssmgZeaMMCE4mSKxHvFYLMm5Upo2yQjkycx");
            equal(w.accountXPrivateKey, "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM");
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPrivateKey, "zprvAfRpmUXV8Bx8m14g129H28qNFL9DJ8GTNS2QqhqhgQ25mEo43oYKCHEn3sYFQb4mPfEU5QnwKZZui1z5fDy4h42sb3PDjYeiDfPUGDtCH8n");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zprvAfRpmUXV8Bx8osLms5d2EidSqJuhHMhcZUpao9zjrYE1aayF9BkHMX5DgnYtkHPsnoiEwVYasn1tW9xArUXkwMvB4tEx7A9Df752CLGkPPt");
            equal(w.internalChainXPublicKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 0);


            w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",
            path: "m/0'/0'"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.chainXPrivateKey, "xprv9xQsQ3WwFzzrPLvoafdumL9AV5fF6o74fGXLi3X7ByziXa11EFrYFwjC17BcNozBYY6p6f4ue7Cq2DCDd29dpYAwBecUR3hef63Xsjcsv2t");
            equal(w.chainXPublicKey, "xpub6BQDoZ3q6NZ9bq1GghAv8U5u37VjWFpv2VSwWRvikKXhQNL9moAnok3frPogvw8GsN5T2ULjz4YoRPBVWi1EY9fGQpazwtQArRrYEHc8diy");
            equal(w.path, "m/0'/0'");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

            w = new Wallet({from: "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa",
                path: "m/0"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K3V76RxiKKREaBYgPkxDtJk2JFZeKT5oUWM5odhxf6VVKWcWYsxkn8zthgTxaxZ4ao5MDuoQ3AxxkZErhAY86wNfkCGn9MTa");
            equal(w.chainXPrivateKey, "xprv9vVvYweCjEDTRTFz9GNEKjcWEEtEPXAgF7tHWLixzJtsKS3T3RoUou7CV3YNfn9BJnr2hkSqHw78pktQszEXPeLEmrxgsLC3e6HfEDpjzUy");
            equal(w.chainXPublicKey, "xpub69VGxTB6ZbmkdwLTFHuEgsZEnGiinytXcLotJj8aYeRrCENbay7jMhRgLHpCqjFa2BMRxgcoakR82JbfRAsUk16CmHE4B5NPs3YP1JeiSVj");
            equal(w.path, "m/0");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

            // from non master private key
            w = new Wallet({from: "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM"});
            equal(w.masterXPrivateKey, undefined);
            equal(w.accountXPrivateKey, "zprvAdMf8RaFvFUw8khtWvUimWvGQVSkBHMgacfBvD9VmLQpGDLVtp1jv51bV3wmJLg54dqm9FDfMEHjd5TYpGFdLmVof8akvPsXM33GQ7NP2GM");
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPrivateKey, "zprvAfRpmUXV8Bx8m14g129H28qNFL9DJ8GTNS2QqhqhgQ25mEo43oYKCHEn3sYFQb4mPfEU5QnwKZZui1z5fDy4h42sb3PDjYeiDfPUGDtCH8n");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zprvAfRpmUXV8Bx8osLms5d2EidSqJuhHMhcZUpao9zjrYE1aayF9BkHMX5DgnYtkHPsnoiEwVYasn1tW9xArUXkwMvB4tEx7A9Df752CLGkPPt");
            equal(w.internalChainXPublicKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");

            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 3);

        });

        it('Wallet from master xPub key', async () => {
            let w = new Wallet({from: "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk"});
            equal(w.accountXPublicKey, "xpub6BxWE1dJh6Ch8UmHyCsonsNxdbYUuHMbkbAeqVXFCVsQKCPZqxyRmizTsr6d6WvfJpNSnUQy2yi9d6jZVSR5NzgaXjYqn95J93yQC5PqkZk");
            equal(w.externalChainXPublicKey, "xpub6ELHwMpBhJNJcumnXDHGVAVY2MQGHEVyVLbsv47J4syasqQjzAXt1vBBVN8s1jxTKniP4NypmswJBsGK1PQQ49WvvrDNUtHYN8h9SX24nuV");
            equal(w.internalChainXPrivateKey, "xpub6ELHwMpBhJNJh56BF1vEzFT8Pod6B5rAPrTKVZFPBzU58NgastaszhFXLBchcsuNwTZLrVgcAJGvrHRQBA33B3UcbRqWwYg3AVhVn7MoCzv");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 3);

            w = new Wallet({from: "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6"});
            equal(w.accountXPublicKey, "ypub6YN9t14SstSTziz45Lj5ivJB3xBKaCLhsp1Nrdagv9cPAiMvxPZTvXTG2D6jnsmGUUK13bDkDVEQu4F2DQpRcd72vHBb2neDf9TRAm9E7K6");
            equal(w.externalChainXPublicKey, "ypub6YeixzAJmVHnobrM7cdCZN3KcX3RsVopsJ9FgFKnte6gXY5pZHQvL72KvCjRBxdAzXsQaii7CcPTooRrKeNDMe1fVaD3Z8DGinm58vgNV2z");
            equal(w.internalChainXPrivateKey, "ypub6YeixzAJmVHnqvRZHMDtbUWxDEhBq9i9KUrNy3gdegVn6x4h6DHqx5BPoisYumVWgsM5f3ByH6bRVaLvJRfFKczg2QnRYBhWDEsQS7X8N73");
            equal(w.path, "m/49'/0'/0'/0");
            equal(w.pathType, "BIP49");
            equal(w.depth, 3);

            w = new Wallet({from: "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss"});
            equal(w.accountXPublicKey, "zpub6rM1Xw79kd3EMEnMcx1j8erzxXHEak5XwqanibZ7Kfwo91feSMKzTsL5LLQFCXTRs6sBpnvis1S7eii3F9y2btCPLXHQMe7h4KoMzLu33Ss");
            equal(w.externalChainXPublicKey, "zpub6tRBAz4NxZWRyV9973gHPGn6oMyhhazJjex1e6FKEjZ4e38CbLrZk5ZFu8sEEWShqfmkuiQ8gs2nXBTr2fEGf2iGE12oRvzbreG7kkZL6rW");
            equal(w.internalChainXPrivateKey, "zpub6tRBAz4NxZWS2MREy7A2braBPLkBgpRTvhkBbYQMQskzTPJPgj4XuKPhY2ytqVcWVMHj1HJQUKkD1JXiuMvPNKLyEQcRLsxbrV49Lsu2K6f");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 3);

            w = new Wallet({from: "xpub661MyMwAqRbcFyBZXzFKgZBJjaWtAQwjfxwu3x3w1RLTP9QxBFGueHooMvsC5tyAcZKpMzxNVUHx1PpZayH74UUHfDMTK9sJ5NZMjB8fMeE",
                            path: 'm'});

            equal(w.chainXPublicKey, "xpub661MyMwAqRbcFyBZXzFKgZBJjaWtAQwjfxwu3x3w1RLTP9QxBFGueHooMvsC5tyAcZKpMzxNVUHx1PpZayH74UUHfDMTK9sJ5NZMjB8fMeE");
            equal(w.path, "m");
            equal(w.pathType, "custom");
            equal(w.depth, 0);

        });

        it('Wallet from mnemonic', async () => {
            let w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select"})
            equal(w.masterXPrivateKey, "zprvAWgYBBk7JR8Gj6Fyh7avt7VXDTaKuFtEUVYfanib1btw1hR5DNsbmpAJQuH8wXje8oCBAh182uNsu78TSW5DEm7DHXGugYYCzX571phh8sd");
            equal(w.accountXPrivateKey, "zprvAds6aiRSB28DPqfPXm381XhejQT74yrcMYFVxKUq3RN6zdfHYhe2kdCfMVN6xizS6TjM2e9usWXBFAfzyof3jEpuw1SBbaN9ZeLTVnifWcN");
            equal(w.accountXPublicKey, "zpub6rrSzDxL1PgWcKjrdna8NfePHSHbUSaTimB6khtSbku5sRzS6ExHJRX9CnQ3YZc5mFDpq3cccw3Pt9KpoX2irELqhMEuzRpaLYqnrhqXqtR");
            equal(w.externalChainXPrivateKey, "zprvAfHTy9snayGyFCFZpHPuGDVTDhiQSAPU1yPT5Q8W6vnzAFoYP3yXDVCcGRUVw74SUXL9MBh4YEovtjyHymr2jnE9J3EFpqHjJmN9mp7cFWq");
            equal(w.externalChainXPublicKey, "zpub6tGpNfQgRLqGTgL2vJvudMSBmjYtqd7KPCK3snY7fGKy348gvbHmmHX67imLvMRewEGMVL45oJdWk47B1ykpZSPAcYCf1Yajphh23MoAoSM");
            equal(w.internalChainXPrivateKey, "zprvAfHTy9snayGyHoJXhR8ASoqSyQ2kuJx9yAPKVjdBTT6c47zKktR19sjXkzbumvB6S9Yh6PdYgXCZszypCmtrvjrBTCi7dy488mfdZFMpYQy");
            equal(w.internalChainXPublicKey, "zpub6tGpNfQgRLqGWHNzoSfAownBXRsFJmg1LPJvJ82o1ndavvKUJRjFhg41cGEYXjVDqx5MGb122nSDdSykH1GKa4Cm6ADZBg8MiwputCcQgHv");
            equal(w.mnemonic, "diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select");
            equal(w.path, "m/84'/0'/0'/0");
            equal(w.pathType, "BIP84");
            equal(w.depth, 0);

            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3});
            equal(combineMnemonic(w.mnemonicShares), w.mnemonic);

            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP44"});
            equal(w.masterXPrivateKey, "xprv9s21ZrQH143K2Vsk2Q1gTwJWsXHS21uEeGWE1zvpFb9AuVnci4YUXgr2NVMxwiRoKWxZfjp17afn8XuL17FBeHk1Yqt4WiuET4wpEcwY7ku");
            equal(w.accountXPrivateKey, "xprv9zHPDQ6wBZ4QzGCNzsjKpEMG6PgQZ8C7esLQRLjqZj22rbeaTc1cQ39hj9oRkFT5zs2yJwdTNnnjqTqp2i1gGod4cShNEJrkFf92rtcvm1r");
            equal(w.accountXPublicKey, "xpub6DGjcudq1vciCkGr6uGLBNHzeRWtxauy26G1Dj9T84Z1jPyj19KrwqUBaS1cSJTMJwTn7pwiGae2vf5GyjXGaF2VMc1mrX6eavUARaiZoiY");
            equal(w.externalChainXPrivateKey, "xprvA1PF3AySergC7tBPGw3y6Q7b5hwBu26Av7TTmfF2xRKg283YiWuAY8a7WYmXja26cjU19nXwFCKGeqVUFnYggQ8TbJ7DSJkZLDA6mYMxH2o");
            equal(w.externalChainXPublicKey, "xpub6ENbSgWLVEEVLNFrNxayTY4KdjmgJUp2HLP4a3eeWkretvNhG4DR5vtbMq2UfT1yGDmrkfy2Df4c4tCpGCUj7dGCvAuCea3GsznkzfwVT1p");
            equal(w.internalChainXPrivateKey, "xprvA1PF3AySergC9m5gadK9JQdCHMBfpGUEsqdD2rP7vxoqDudvLPDrZsJc2ZeeLHhLQ5A94v2updumYivjRhWXxyyT4Ad8DNMDKkkvyLaDJQj");
            equal(w.internalChainXPublicKey, "xpub6ENbSgWLVEEVNFA9ger9fYZvqP2ADjC6F4YoqEnjVJLp6hy4svY77fd5sqJ573XNTQ1LTnQQiRj2MWMdoGm2CW3CANLZyquGASx2dURRKD8");
            equal(w.mnemonic, "diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select");
            equal(w.path, "m/44'/0'/0'/0");
            equal(w.pathType, "BIP44");
            equal(w.depth, 0);
        });

        it('Wallet getAddress method', async () => {
            let w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP44"});
            equal(w.getAddress(0).privateKey, 'L45mfkreqWrCfjdttVv7WU69MSmmw38FZvcSwg66thqm9J9PK9KZ');
            equal(w.getAddress(0).publicKey, '02a933ce23a6b48dfb4621e8c71cc1541993318ce667c569b8affd2278ac24aa84');
            equal(w.getAddress(0).address, '17GdQe4Cc8bA2LdNqnEs5Bg4aX1fDe2bS9');
            equal(w.getAddress(0, false).address, '1LiMan5g9YXqchuTYZ7ty1isjVH7VewkvT');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP49"});
            equal(w.getAddress(0).address, '3EDe79YchJeaAjSkHem5NyMqTMHfm91osd');
            equal(w.getAddress(0, false).address, '36WLfXx7Jj17GVHbQcMunCVQ7dhKuKEmPb');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"BIP84"});
            equal(w.getAddress(0).address, 'bc1qk2k3lgzhpu227p9fvju6tnkxjxfrqef3mxurze');
            equal(w.getAddress(0, false).address, 'bc1qaksfv2t58actx25pr9mnnavsnkxp5sp5uwtzca');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"m/0'/0'"});
            equal(w.getAddress(0).address, '1Bwi9boQTQ57XVpa71GcX8MvjB1onTKqep');
            w = new Wallet({from:"diary fresh float ostrich clean path tooth battle rebel nerve blood shock vital travel poet profit oval super lens purse army girl protect select",
                threshold: 2, shares:3, path:"m/0'/0'", hardenedAddresses: true});
            equal(w.getAddress(0).address, '1BQHhRpCAXmAVucAmQvZpj6uPkoh2dNQjh');
        });
    });


});
