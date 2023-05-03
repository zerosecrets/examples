import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { IntOrString, KubeDeployment, KubeService } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const label = { app: 'nginx-project' };

    new KubeService(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, targetPort: IntOrString.fromNumber(80) }],
        selector: label,
      },
    });

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'nginx',
                image: 'nginx',
                ports: [{ containerPort: 80 }],
              },
            ],
          },
        },
      },
    });
  }
}

const app = new App();
new MyChart(app, 'nginx-project');
app.synth();
