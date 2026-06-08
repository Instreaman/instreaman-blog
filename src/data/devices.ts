// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Apple: [
		{
			name: "iPhone 15 Pro",
			image: "/images/device/iphone15pro.png",
			specs: "黑色钛金属 / 512GB",
			description: "A17 Pro 芯片，3nm 工艺，钛金属设计，支持 USB-C",
			link: "https://www.apple.com.cn/iphone-15-pro/",
		},
	],
	Lenovo: [
		{
			name: "ThinkBook 16 G6+ IMH",
			image: "/images/device/thinkbook16.png",
			specs: "Ultra 9 185H / 32GB / Intel Arc",
			description: "16英寸 3.2K 屏幕，高性能商务本，适合开发和办公",
			link: "https://www.lenovo.com.cn/",
		},
	],
};
