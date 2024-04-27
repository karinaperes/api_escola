const {Router} = require('express')
const alunoRoutes = new Router()
const Aluno = require('../models/Aluno')

const {auth} = require('../middleware/auth')


////// ------- Alunos ------- //////


alunoRoutes.post('/', async (req, res) => {

    try {
        const email = req.body.email
        const password = req.body.password
        const nome = req.body.nome
        const data_nascimento = req.body.data_nascimento
        const celular = req.body.celular
    
    // TODO Dúvida: inserir status 400 para email e password?
        if (!nome) {
            return res.status(400).json({erro:'O nome deve ser informado'})            
        }
        if (!data_nascimento) {
            return res.status(400).json({erro:'Preencha a data de nascimento'})
        }
        if (!data_nascimento.match(/\d{4}-\d{2}-\d{2}/gm)) {
            return res.status(400).json({erro:'A data de nascimento deve estar no formato AAAA-MM-DD'})
        }
        const aluno = await Aluno.create({
            email: email,
            password: password,
            nome: nome,
            data_nascimento: data_nascimento,
            celular: celular
        })

        res.status(201).json(aluno)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({erro: 'Não foi possível efetuar o cadastro'})
    }
})

alunoRoutes.get('/', auth, async (req, res) => {
    const alunos = await Aluno.findAll()
    res.json(alunos)
})

alunoRoutes.get('/:id', auth, async (req, res) => {
    try {
        const {id} = req.params
        const aluno = await Aluno.findByPk(id)

        if (!aluno) {
            return res.status(404).json({erro: "Aluno não foi encontrado"})            
        }

        res.json(aluno)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error: "Não foi possível localizar o aluno",
            error:error
        })
    }
})

alunoRoutes.put('/:id', auth, async (req,res) => {
    const {id} = req.params
    
    try {
        const aluno = await Aluno.findByPk(id)
        if(!aluno){
            return res.status(400).json({erro: 'Aluno não encontrado'})        
        }
        await aluno.update(req.body)
        await aluno.save()    
        res.status(200).json({mensagem: 'Alterado com sucesso!'})
    } catch (error){
        console.log(error)
        return res.status(500).json({erro: 'Erro ao atualizar aluno'})
    }    
})

alunoRoutes.delete('/:id', auth, async (req, res) => {
    try {
        const {id} = req.params
        const aluno = await Aluno.findByPk(id)

        if (!aluno) {
            return res.status(404).json({erro: "Aluno não foi encontrado"})            
        }

        Aluno.destroy({
            where: {
                id: id
            }
        })

        res.status(204).json({mensagem: 'Aluno excluído com sucesso'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            error: "Não foi possível localizar o aluno",
            error:error
        })
    }
})


module.exports = alunoRoutes