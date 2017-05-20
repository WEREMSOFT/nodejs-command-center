class Node{

	constructor(pData){
		this.data = pData;
		this.childs = [];
		this.parent = null;
	}

	addChild(pChild){
		this.childs.push(pChild);
		pChild.parent = this;
	}

	removeChild(pChild){
		//TODO: Not Implemented
	}
}

module['exports'] = Node;