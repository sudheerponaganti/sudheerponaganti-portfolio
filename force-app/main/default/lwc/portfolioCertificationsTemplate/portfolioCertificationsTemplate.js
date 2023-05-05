import { LightningElement ,api} from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets';
export default class PortfolioCertificationsTemplate extends LightningElement {
certImg
_certName

adminCetImg = `${PortfolioAssets}/PortfolioAssets/Certificates/adminCert.jpg`
associateCertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/associateCert.jpg`
pd1CertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/pd1Cert.jpg`
jsDev1CertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/jsDev1Cert.jpg`
platformAppBuilderCertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/platformAppBuilderCert.jpg`
fscApCertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/fscApCert.jpg`
aplusCertImg = `${PortfolioAssets}/PortfolioAssets/Certificates/aPlusCert.jpg`

@api
get certName(){
 return this._certName
}

set certName(data){
    this._certName = data;
    switch(this._certName) {
        case 'Salesforce Certified Associate':
           this.certImg = this.associateCertImg
           break;
        case 'Salesforce Certified Administrator':
            this.certImg = this.adminCetImg
           break;

        case 'Salesforce Certified JavaScript Developer I':
            this.certImg = this.jsDev1CertImg
            break;
        case 'Salesforce Certified Platform App Builder':
            this.certImg = this.platformAppBuilderCertImg
            break;
        case 'Salesforce Certified Platform Developer I':
            this.certImg = this.pd1CertImg
            break;
        case 'Financial Services Cloud Accredited Professional':
            this.certImg = this.fscApCertImg
            break;
        case 'Capgemini A-Plus Certified Professional':
            this.certImg = this.aplusCertImg
             break;
        default:
          // code block
      }
}


    backHandler(){
        const backEvent = new CustomEvent('back', { detail: false });
        this.dispatchEvent(backEvent)
    }

}