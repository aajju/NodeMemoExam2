var express = require('express');
var router = express.Router();
var MembeerDAO = require('../models/MemberDAO');

/* GET api listing. */
router.post('/member/check', function (req, res) {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({error: "이메일은 공백이 될 수 없습니다"});
    }
    //
    // const password = req.body.password;
    //
    // if(!password) {
    //     return res.status(400).json({error: "이메일은 공백이 될 수 없습니다"});
    // }

    MembeerDAO.duplicateCheck(email, function (errorMessage, result) {
        if (errorMessage) { // DB 또는 SQL에서 문제가 생김
            return res.status(500).json({error: "DB 작업 중 에러가 발생했습니다!"})
        } else {  // DB 관련 문제는 발생하지 않았음
            if (result) {
                // 중복이 되지 않았을 경우
                return res.status(200).send();
            } else {
                // 중복이 되었을 경우
                return res.status(409).send();
            }
        }
    })
});

router.post('/member/join', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        return res.status(400).json({error: "이메일은 공백이 될 수 없습니다"});
    }
    if (!password) {
        return res.status(400).json({error: "비번은 공백이 될 수 없습니다"});
    }

    MembeerDAO.join(email, password, function (errorMessage, result) {
        if (errorMessage) {
            return res.status(500).json({error: "DB 작업 중 에러 발생"});
        } else {
            if (result) {
                return res.status(200).send();
            }
        }
    })
});

router.post('/member/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        return res.status(400).json({error: "이메일은 공백이 될 수 없습니다"});
    }
    if (!password) {
        return res.status(400).json({error: "비번은 공백이 될 수 없습니다"});
    }

    MembeerDAO.login(email, password, function (errorMessage, result) {
        if (errorMessage) {
            return res.status(500).json({error: "DB 작업 중 에러 발생"});
        } else {
            if (result) {
                return res.status(200).send();
            } else {
                return res.status(400).send();
            }
        }
    })
});


module.exports = router;
