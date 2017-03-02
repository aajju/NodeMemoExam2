var express = require('express');
var router = express.Router();
var MembeerDAO = require('../models/MemberDAO');
var MemoDAO = require('../models/MemoDAO');
var auth = require('../auth/auth');


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
            if (result){
                return res.status(200).append('x-auth-token', auth.generateToken(email)).send();
            } else {
                return res.status(400).send();
            }
        }
    })
});

//클라이언트가 요청을 했는데, 마지막 url이 /memo일 경우 이 메소드를 거쳐간다. (미들웨어 함수)
router.use('/memo', function (req, res, next) {
    // 헤더에서 'x-auth-token'에 해당하는 값을 읽어온다
    let token = req.header('x-auth-token');

    if (!token) {
        return res.status(403).send();  // 403 : 허가 되지 않는 접근
    }

    auth.verifyToken(token, function (isSuccessful, errorMessage) {
        if(!isSuccessful) {
            return res.status(403).json({error: errorMessage});
        }
        next();
    })
});


//메모 리스트 리턴
router.get('/memo', function (req, res) {
    MemoDAO.getMemoList(function (error, data) {
        if(error) {
            if(error === 'Empty') {
                return res.status(404).json({error: '가져올 메모 리스트가 존재하지 않습니다!'});
            }
            return res.status(500).json({error: error});
        }
        return res.status(200).json(data);
    })
});


//메모추가
router.post('/memo', function (req, res) {
    const title = req.body.title;
    const contents = req.body.contents;
    if (!title){
        return res.status(400).json({error: "제목은 공백이 될 수 없습니다"});
    }
    if (!contents){
        return res.status(400).json({error: "내용은 공백이 될 수 없습니다"});
    }


    MemoDAO.insert(title, contents, function (errorMessage, result) {
        if(errorMessage) {
            return res.status(500).json({error: "DB 작업 중 에러 발생"});
        } else {
            if (result) {
                return res.status(200).send();
            }
        }
    })

});


//메모수정
router.put('/memo', function (req, res) {
    let id = req.body.id;
    const title = req.body.title;
    const contents = req.body.contents;

    if (!id){
        return res.status(400).json({error: "id는 공백이 될 수 없습니다"});
    }

    id = parseInt(id, 10);

    if(!id) {
        return res.status(400).json({error: "id의 형식이 올바르지 않습니다."});
    }

    if (!title){
        return res.status(400).json({error: "제목은 공백이 될 수 없습니다"});
    }
    if (!contents){
        return res.status(400).json({error: "내용은 공백이 될 수 없습니다"});
    }

    MemoDAO.updateMemo(id, title, contents, function (errorMessage, result) {
        if(!result) {
            return res.status(500).json({error: errorMessage});
        }
        return res.status(201).send();
    })

});

//메모 삭제
router.delete('/memo', function (req, res) {
    let id = req.body.id;
    if (!id){
        return res.status(400).json({error: "id는 공백이 될 수 없습니다"});
    }
    id = parseInt(id, 10);

    if(!id) {
        return res.status(400).json({error: "id의 형식이 올바르지 않습니다."});
    }

    MemoDAO.deleteMemo(id, function (error, result) {
        if(!result) {
            return res.status(500).json({error: error});
        }
        return res.status(201).send();
    })
});

module.exports = router;
