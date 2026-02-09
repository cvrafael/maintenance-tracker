const { Runin, Rack, Position } = require('../../../models/index.js');
const { Op } = require('sequelize');

module.exports = {

  /**
   * 🔹 Retorna todos os runins com racks e posições
   * (para renderizar a tabela)
   */
  async find_all(req, res) {
    try {
      const data = await Runin.findAll({
        attributes: ['id', 'runin'],
        include: [
          {
            model: Rack,
            attributes: ['id', 'rack'],
            include: [
              {
                model: Position,
                attributes: ['id', 'position', 'status'],
              },
            ],
          },
        ],
        order: [
          ['runin', 'ASC'],
          [Rack, 'rack', 'ASC'],
          [Rack, Position, 'position', 'ASC'],
        ],
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Erro ao buscar maintenance' });
    }
  },

  /**
   * 🔹 Busca uma posição específica
   * runin + rack + position
   */
  async find_one_position(req, res) {
    try {
      const { runin, rack, position } = req.params;

      const data = await Position.findOne({
        where: {
          position,
        },
        include: [
          {
            model: Rack,
            where: { rack },
            include: [
              {
                model: Runin,
                where: { runin },
              },
            ],
          },
        ],
      });

      if (!data) {
        return res.status(404).json({ message: 'Posição não encontrada' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Erro ao buscar posição' });
    }
  },

  /**
   * 🔹 Atualiza o status da posição
   * (botão Solid do frontend)
   */
 async update_status(req, res) {
  try {
    const { runin, rack, position, status, defect } = req.body;

    if (!['OK', 'NOK'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // 1️⃣ acha o rack correto (JOIN implícito)
    const rackFound = await Rack.findOne({
      where: { rack },
      include: [
        {
          model: Runin,
          where: { runin },
          attributes: [],
        },
      ],
    });

    if (!rackFound) {
      return res.status(404).json({ error: 'Rack não encontrado' });
    }

    // 2️⃣ update usando FK (igual ao SQL)
    const [updated] = await Position.update(
      {
        status,
        defect,
      },
      {
        where: {
          fk_id_rack: rackFound.id,
          position,
        },
      }
    );

    return res.status(200).json({
      message: 'Status atualizado com sucesso',
      updated,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar status' });
  }
}

};
