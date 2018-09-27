import { BaseDAO } from '../baseDAO';

import { TicketSaleEntity } from '../../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { PagSeguroIntegration } from '../../shared/pagseguro/pagseguro';

export class PagSeguroDAO extends BaseDAO { 
    public processPayment(sales: TicketSaleEntity, callback) {
        let pag = this.initPagSeguro();

        let items: number = 1;
        sales.vouchers.forEach(v=> {
            pag.addItem({
                id: items,
                description: v.ticketType.name,
                amount: v.ticketType.total,
                quantity: v.amount,   
            });

            items++;
        });   
        
        //Configurando as informações do comprador
        pag.buyer({
            name: sales.buyerInfo.name,
            email: sales.buyerInfo.email,
            phoneAreaCode: '51',
            phoneNumber: '12345678',
            document: sales.buyerInfo.document
        });

        //Configurando a entrega do pedido
        pag.shipping({
            type: 3,
            street: sales.buyerInfo.address,
            number: sales.buyerInfo.number,
            complement: '',
            postalCode: sales.buyerInfo.zipCode,
            city: sales.buyerInfo.city,
            state: sales.buyerInfo.state,
            district: sales.buyerInfo.district,
            country: 'BRA'
        });

        pag.creditCard(sales.cardInfo, sales.total, sales.buyerInfo)

        //Configuranto URLs de retorno e de notificação (Opcional)
        //ver https://pagseguro.uol.com.br/v2/guia-de-integracao/finalizacao-do-pagamento.html#v2-item-redirecionando-o-comprador-para-uma-url-dinamica
        pag.setRedirectURL("http://www.lojamodelo.com.br/retorno");
        //pag.setNotificationURL("http://www.lojamodelo.com.br/notificacao");

        //Enviando o xml ao pagseguro
        pag.send(function(err, res) {
            if (err) {
                return callback(null, err);
            }
            
            console.log(res);
            return callback(res, null);
        });
    }

    private initPagSeguro(): PagSeguroIntegration {
        //Inicializar a função com o e-mail e token
        let pag = new PagSeguroIntegration({
            email : 'ingressos@appondeir.com.br',
            token: '3E1FEB5780844220A58412FEF0516159',
            mode : 'direct-sandbox'
        });

        //Configurando a moeda e a referência do pedido
        pag.currency('BRL');        
        pag.reference('12345');

        return pag;
    }
}