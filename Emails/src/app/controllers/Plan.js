import xlsx from 'xlsx';
import path from 'path';
import User from '../models/User';
import Mail from '../../lib/Mail';
async function Plan() {
    
        const filePath = path.join(`${__dirname}/../../../../Plano de Ação Daily Plant Tour.xlsx`);
        const plan = xlsx.readFile(filePath);
        
        const action = xlsx.utils.sheet_to_json(plan.Sheets['ACTION PLAN']);
        
        const late = action.filter(cell => cell.__EMPTY_1 === 'R');
        
        if(late.length > 0){
        const names = late.map((cell) => cell.__EMPTY_4);
      
        const emails = await User.findAll({
            raw:true,
            attributes:['email','name'],
            where: {
                name: names.map((a) => a),
            }
        });
        const todos = late.map(a => {
            a.email = emails.filter(email => email.name === a.__EMPTY_4);
            if(a.__EMPTY_7 > 7){
                a.copy = 'eduardo.villalba@sogefigroup.com'
            }else{
                a.copy = 'delio.santos@sogefigroup.com'
            }
            return a; 
        });
    
    await todos.map((plan) => 
        Mail.sendMail({
            to: `${plan.__EMPTY_4} <${plan.email[0].email}>`,
            cc: `${plan.copy}`,
            subject: 'DAILY PLANT TOUR',
            template: 'latehoshin',
            context: {
                name: plan.__EMPTY_4,
                type: plan.__EMPTY,
                problema: plan.__EMPTY_2,
                acao: plan.__EMPTY_3,
                atraso: plan.__EMPTY_7,
                autor: plan.__EMPTY_10,
            }
        })
    )
    
   
    }else{
        console.log('Sem plano de ação atrasado em dayli plant tour');
    }

}
export default Plan;
/* __EMPTY = type 
   __EMPTY_1 = STATUS
   __EMPTY_2 = PROBELMA
   __EMPTY_3 = AÇÃO
   __EMPTY_4 = RESPONSAVEL
   __EMPTY_7 = DIAS EM ATRASO
   aceesar email = a.email[0].email
*/